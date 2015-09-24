Array.prototype.doclean = function() {
	var a = [];
	var l = this.length;
	for(var i=0; i<l; i++) {
		for(var j=i+1; j<l; j++) {
			if (this[i].replace(/^\s+/g,'').replace(/\s+$/g,'') === this[j].replace(/^\s+/g,'').replace(/\s+$/g,''))
			j = ++i;
		}
		if (this[i].replace(/^\s+/g,'').replace(/\s+$/g,'').length>0) { a.push(this[i].replace(/^\s+/g,'').replace(/\s+$/g,'')); }
	}
	return a.join(", ");
};
function GetMetaValue(meta_name) {
	var my_arr=document.getElementsByTagName("meta");
	for (var counter=0; counter<my_arr.length; counter++) {
		if (my_arr[counter].name.toLowerCase() == meta_name.toLowerCase()) {
			return my_arr[counter].content;
		}
	}
	return "";
}
function document_keywords(metas){
    var keywords = '';
    for (var x=0,y=metas.length; x<y; x++) {
        keywords += ",";
        if (metas[x].name.toLowerCase() == "keywords") {
            keywords += metas[x].content + " ";
        }
    }
    keywords = keywords.split(",");
    keywords = keywords.doclean();
    return keywords != '' ? keywords : "";
}
chrome.extension.sendRequest({ method: "getShortcutKey" }, function (response) {
	shortcut.add(response.add, function () {
		chrome.extension.sendRequest({ command: "add" }, function (response) { });
	});
	shortcut.add(response.manage, function () {
		chrome.extension.sendRequest({ command: "manage" }, function (response) { });
	});
});
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.action == "getDOM") {
		if (window.document.getElementsByTagName('meta') == undefined) 
			var the_labels = "";
		else
			var the_labels = document_keywords(window.document.getElementsByTagName('meta'));
		if (window.getSelection().toString() == "")
			var the_selection = GetMetaValue("description");
		else
			var the_selection = window.getSelection().toString();
		var additionalInfo = { "labels": the_labels, "selection": the_selection };
		sendResponse({info: additionalInfo});
	}
});