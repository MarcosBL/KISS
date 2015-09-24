function $(id) {
  return document.getElementById(id);
}
Function.prototype.bind = function(scope) {
  var _function = this;
  return function() {
    return _function.apply(scope, arguments);
  }
};
var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};
function translate() {
	elements = getElementsByClassName("t");
	for(var i in elements)	{
		elements[i].innerText = chrome.i18n.getMessage(elements[i].id);
	}
}
function save_options() {
	var bkg = chrome.extension.getBackgroundPage();
	bkg.settings.shortcutKeyAdd = $("shortcut_key_add").value;
	bkg.settings.shortcutKeyManage = $("shortcut_key_manage").value;
	bkg.settings.popupOnAdd = $('popup_on_add').checked;
	bkg.settings.VisualGuide = $('visual_guide').checked;
	bkg.settings.VisualAnimations = $('visual_animations').checked;
	bkg.settings.UseMagic = $('use_magic').checked;

	var note = $('conf_save_note');
	note.style.display = "none";
	var info = $('conf_info_message');
	info.style.display = 'inline';
	info.style.opacity = 1;
	setTimeout(function () {
		info.style.opacity = 0.0;
	}, 1000);
}
function restore_options() {
	var bkg = chrome.extension.getBackgroundPage();
	$("shortcut_key_add").value = bkg.settings.shortcutKeyAdd;
	$("shortcut_key_manage").value = bkg.settings.shortcutKeyManage;
	$('popup_on_add').checked = bkg.settings.popupOnAdd;
	$('visual_guide').checked = bkg.settings.VisualGuide;
	$('visual_animations').checked = bkg.settings.VisualAnimations;
	$('use_magic').checked = bkg.settings.UseMagic;
	show_hide_animations();
}
function close_window() {
	window.close();
}
function toggle(element) {
	var note = $(element);
	if (note.style.display == "none") {
		note.style.display = "block";
	}
	else
	{
		note.style.display = "none";
	}
}
function show_hide_animations() {
	($('visual_guide').checked) ? $('visual_animations_container').style.display = "block" : $('visual_animations_container').style.display = "none";
}
function init_options(){
	translate();
	restore_options();
}
