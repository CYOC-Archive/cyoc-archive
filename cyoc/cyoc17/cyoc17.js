/* CYOC JS by mboy 2013-2018 */

/* W3C cross-browser addEvent+fallback */
function addEvent(e,ev,f){if(e.addEventListener){e.addEventListener(ev,f,false);return true}else if(e.attachEvent){e.attachEvent('on'+ev,f)}else{e['on'+ev]=f}}

function el(e){return document.getElementById(e)}
function show(e){el(e).style.display='block'}
function hide(e){el(e).style.display='none'}
function eventPreventDefault(e){if(e.preventDefault)e.preventDefault();else e.returnValue=false}
function setCookie(c,v,expireDays){var d=new Date();d.setTime(d.getTime()+(expireDays*24*60*60*1000));document.cookie=c+'='+v+'; expires='+d.toUTCString()}
function removeCookie(c){document.cookie=c+'=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'}
function stopPropagation(e){if(typeof e.stopPropagation!=='undefined')e.stopPropagation();else e.cancelBubble=true}



/* Search Panel */
var CYOCSearch=(function(){
	var NO_STORY='any story';
	var NO_AUTHOR='anyone';
	var TAG_NONE='none';
	var TAG_MORE='<i class=\"fa fa-plus\"></i> more';
	var LOADING='*loading*';

	var spanAddTag=document.createElement('span');
	spanAddTag.className='filter';
	spanAddTag.id='filter-tag';

	function cleanNumericVal(num){
		return parseInt(num.replace(/[^0-9]+/g,'').replace(/^0+/g,'')) || 0
	}
	return{
		validStoryId:null,
		validStoryName:null,
		validAuthorId:null,
		validAuthorName:null,

		initialize:function(){
			addEvent(el('filter-story'), 'click', this.clickStory);
			addEvent(el('filter-author'), 'click', this.clickAuthor);
			addEvent(el('search-filter-story'), 'blur', this.blurStory);
			addEvent(el('search-filter-author'), 'blur', this.blurAuthor);

			addTagEvent(el('search-filter-tag'));
			addEvent(spanAddTag, 'click', this.addTag);
			el('filters').appendChild(spanAddTag);
			this.refreshTags();
		},

		addTag:function(){
			show('float-search-filter-tag');
			el('search-filter-tag').focus();
		},
		addTag2:function(){
			if(!el('search-filter-tags').value.length){
				el('search-filter-tags').value=this.tagId
			}else{
				var tags=el('search-filter-tags').value.split(/,/);
				if(tags.indexOf(this.tagId)===-1)
					el('search-filter-tags').value+=','+this.tagId;
			}
			hide('float-search-filter-tag');
			CYOCSearch.refreshTags();
		},
		removeTagEvent:function(){
			var tags=el('search-filter-tags').value.split(/,/);
			tags.splice(this.filterNumber, 1);
			el('search-filter-tags').value=tags.join(',');
			CYOCSearch.refreshTags();
		},
		refreshTags:function(){
			el('filter-tags').innerHTML='';

			if(el('search-filter-tags').value.length){
				var tags=el('search-filter-tags').value.split(/,/);
				for(var i=0; i<tags.length; i++){
					var spanFilter=document.createElement('span');
					spanFilter.innerHTML=CYOC.TAGS[tags[i]];
					spanFilter.className='filter';
					spanFilter.filterNumber=i;
					addEvent(spanFilter,'click',this.removeTagEvent);
					el('filter-tags').appendChild(spanFilter);
				}
				spanAddTag.innerHTML=TAG_MORE;
				el('search-filter-tags').disabled=false;
			}else{
				spanAddTag.innerHTML=TAG_NONE;
				el('search-filter-tags').disabled=true;
			}
		},

		/* story */
		clickStory:function(){
			if(el('search-filter-story').disabled){
				if(CYOCSearch.validStoryId){
					CYOCSearch.setStory(CYOCSearch.validStoryId, CYOCSearch.validStoryName);
				}else{
					el('search-filter-story').disabled=false;
				}
				show('float-search-filter-story');
				el('search-filter-story').focus();
			}else{
				CYOCSearch.setStory(false)
			}
		},
		blurStory:function(){
			var storyId=cleanNumericVal(el('search-filter-story').value);
			if(storyId===CYOCSearch.validStoryId){
				CYOCSearch.setStory(CYOCSearch.validStoryId,CYOCSearch.validStoryName);
			}else if(storyId){
				el('filter-story').innerHTML=LOADING;
				sendAjax('getstoryname='+storyId);
			}else{
				CYOCSearch.setStory(false);
			}
			hide('float-search-filter-story');
		},
		setStory:function(storyId,storyName){
			el('search-filter-story').disabled=!storyId;
			if(storyId){
				this.validStoryId=parseInt(storyId);
				this.validStoryName=storyName;
				el('search-filter-story').value=storyId;
				el('filter-story').innerHTML=storyName;
			}else{
				el('filter-story').innerHTML=NO_STORY;
			}
		},



		/* author */
		clickAuthor:function(){
			if(el('search-filter-author').disabled){
				if(CYOCSearch.validAuthorId){
					CYOCSearch.setAuthor(CYOCSearch.validAuthorId, CYOCSearch.validAuthorName);
				}else{
					el('search-filter-author').disabled=false;
				}
				show('float-search-filter-author');
				el('search-filter-author').focus();
			}else{
				CYOCSearch.setAuthor(false)
			}
		},
		blurAuthor:function(){
			var authorId=cleanNumericVal(el('search-filter-author').value);
			if(authorId===CYOCSearch.validAuthorId){
				CYOCSearch.setAuthor(CYOCSearch.validAuthorId,CYOCSearch.validAuthorName);
			}else if(authorId){
				el('filter-author').innerHTML=LOADING;
				sendAjax('getauthorname='+authorId);
			}else{
				CYOCSearch.setAuthor(false);
			}
			hide('float-search-filter-author');
		},
		setAuthor:function(authorId,authorName){
			el('search-filter-author').disabled=!authorId;
			if(authorId){
				this.validAuthorId=parseInt(authorId);
				this.validAuthorName=authorName;
				el('search-filter-author').value=authorId;
				el('filter-author').innerHTML=authorName;
			}else{
				el('filter-author').innerHTML=NO_AUTHOR;
			}
		}
	}
}());












function toggleNoteForm(val){
	el('row-author-note').style.display=val?'block':'none';
}



function reportChapter(chapterId){
	var newWindow=window.open(CYOC.URL_REPORT);
	addEvent(newWindow,'load',function(){
		var inputs=newWindow.document.getElementsByTagName('input');
		for(var i=0; i<inputs.length; i++){
			var input=inputs[i];
			if(input.name=='postimageselect' && input.value==4){
				input.checked=true;
			}else if(input.name=='subject'){
				input.value='Report: Chapter #'+chapterId;
			}
		}
		var textareas=newWindow.document.getElementsByTagName('textarea');
		for(var i=0; i<textareas.length; i++)
			if(textareas[i].name=='message')
				textareas[i].value=CYOC.URL+'/chapter_'+chapterId+'.html';
	});
}

var CYOC={
	URL_ROOT:'https://www.cyoc.net/',
	URL:'https://www.cyoc.net/interactives/',
	KEY:{
		'A':'Animal',
		'AR':'Age Regression',
		'AP':'Age Progression',
		'BM':'Body Modification (muscle, features, etc.)',
		'I':'Inanimate',
		'S':'Size (shrinking, growing)',
		'TG':'Transgender',
		'O':'Other',
		'n':'Nudity',
		'm':'Self pleasure male',
		'mm':'M/M Sex',
		'mf':'M/F Sex',
		'ff':'F/F Sex',
		'f':'Self pleasure female',
		'x':'Sex beyond any of the above',
		'v':'Violence'
	},

	TAGS:{1:'Animal',2:'Age Regression',3:'Age Progression',4:'Body Modification',5:'Inanimate',6:'Size (shrinking, growing)',7:'Transgender',50:'Mythological',51:'Male',52:'Female',53:'Muscle',54:'Shrinking',55:'Macro',56:'Elderly',57:'Anthro',58:'Magic',59:'Clothes',60:'Furniture',61:'Underwear',62:'Speedo',63:'Mental',64:'Weight gain',65:'Vehicle',66:'Robot',67:'Kid',68:'Young adult',69:'Adult',70:'Toddler',71:'Baby',72:'Fat',73:'Shower',74:'Canine',75:'Equine',76:'Feline',77:'Bovine',78:'Reptilian',79:'Aquatic',80:'Hairy',81:'Ungulate',82:'Ethnic',83:'Sports',84:'Soccer',85:'Football',86:'Wrestling',87:'Swimming',88:'Sumo',89:'Football',90:'Group',91:'Jock',92:'College',93:'School',94:'Feet',95:'Superpowers',96:'Spandex',97:'Female to male',98:'Male to female',99:'Cock',100:'Dragon',101:'Satyr',102:'Race change',103:'Reality alteration',104:'Vore',105:'Body merge',106:'Body swap',107:'Singlet',108:'Avian',109:'Insect',110:'Multilimb',111:'Body (or parts) theft',112:'Historical',113:'Absorption',114:'Liquify',115:'Ghost',116:'Herm'}
};
/* 2017 */
function url(s){return CYOC.URL+s}
function link(s,t){return '<a href=\"'+url(s)+'\">'+t+'</a>'}


function searchTag(){
	var str=focusedTag.value;
	var result=el('result-tags');
	while(result.firstChild)
		result.removeChild(result.firstChild);

	var q=str.toLowerCase().replace(/[^a-z ]/,'');
	if(q){
		var regex=new RegExp('('+q+')','i');
		var results=0;
		for(tagId in CYOC.TAGS){
			if(focusedTag!==el('search-filter-tag') && tagId<50)
				continue;

			var tagName=CYOC.TAGS[tagId];
			if(tagName.toLowerCase().indexOf(q)!==-1){
				var li=document.createElement('li');
				li.innerHTML=tagName.replace(regex, '<b>$1</b>');
				li.tagId=tagId;
				if(focusedTag===el('search-filter-tag')){
					addEvent(li,'mousedown',CYOCSearch.addTag2); //mousedown fires before blur
				}else{
					addEvent(li,'mousedown',clickTagLi); //mousedown fires before blur
				}
				result.appendChild(li);
				results++;
				if(results==6)
					break;
			}
		}
	}
}


function addTagEvent(e){
	addEvent(e,'keyup',searchTag);
	addEvent(e,'focus',focusTag);
	addEvent(e,'blur',function(){hide('result-tags')});
	e.setAttribute('autocomplete','off');
}
function clickTagLi(){
	var tagPos=focusedTag.id.replace('input-tag','');
	var tagId=this.tagId;

	el('tag'+tagPos).checked=true;
	el('tag'+tagPos).value=tagId;

	checkTag(tagPos);
	hide('result-tags');
}

function checkTag(tagPos){
	var checkbox=el('tag'+tagPos);
	var input=el('input-tag'+tagPos);

	if(checkbox.checked && checkbox.value>=50){
		input.value=CYOC.TAGS[checkbox.value];
		input.disabled=true;
	}else{
		input.disabled=false;
		input.value='';
		checkbox.value=0;
		checkbox.checked=false;
	}	
}

var focusedTag;
function focusTag(){
	focusedTag=this;
	searchTag();
	show('result-tags');
	moveResultTag();
}



function moveResultTag(){
	if(focusedTag){
		var result=el('result-tags');
		var inputPos=focusedTag.getBoundingClientRect();

		result.style.top=parseInt(inputPos.top+30+window.scrollY)+'px';
		result.style.left=parseInt(inputPos.left)+'px';
		result.style.width=parseInt(inputPos.width)+'px';
	}
}

function resizeWindow(){
	moveResultTag();
}


/* ************************** */




function toggleListMode(){
	var lists=document.querySelectorAll('ul.chapter-list');
	var newList;
	if(/grid/.test(lists[0].className))
		newList='list';
	else
		newList='grid';

	for(var i=0;i<lists.length;i++)
		lists[i].className='chapter-list '+newList;

	setCookie('listMode',newList,365);
}

var toggleZones=new Array();

function hideToggler(e){
	el(e).className=el(e).className.replace(' toggled','');
}


function setScrolling(s){
	if(s){
		document.body.style.width='auto';
		document.body.style.position='static';
		document.body.style.overflowY='auto'
	}else{
		document.body.style.width='100%';
		document.body.style.position='fixed';
		document.body.style.overflowY='scroll'
	}
}




function hideNotification(n,cookieDays){
	el('notification-'+n).className+=' notification-closed';
	if(cookieDays){
		//setCookie('hidenotification-'+n,1,cookieDays);
	}
	window.setTimeout(function(){el('notifications').removeChild(el('notification-'+n))}, 400);
}










function addToggler(toggler, zone){
	if(el(toggler)){
		addEvent(el(toggler), 'mouseover', function(){
			show(zone);
		});
		addEvent(el(toggler), 'mouseout', function(){
			hide(zone);
		});
		addEvent(el(toggler), 'click', function(){
			void(0);
		});
	}
}
function validateChapterForm(){
	var errors=new Array();
	el('postchapter-errors').innerHTML='';

	if(el('title').value==''){
		errors.push("Title is a required field.");
	}

	if(el('option_title')){
		if(el('option_title').value==''){
			errors.push("Option title is a required field.");
		}
	}

	if(el('email_address')){
		if(el('email_address').value && !/^.+@.+\..+$/.test(el('email_address').value)){
			errors.push("E-mail address is not valid.");
		}
	}

	if(el('textarea-description')){
		if(el('textarea-description').value==''){
			errors.push("Chapter description is a required field.");
		}else if(el('textarea-description').value.length<500){
			errors.push("Chapter description is too short. Posting short chapters is a bannable offense.");
		}
	}

	var i=1;
	var tf=false;
	while(el('checkbox-trans_type'+i)){
		if(el('checkbox-trans_type'+i).checked){
			tf=true;
		}
		i++;
	}
	if(!tf){
		errors.push("Please select at least 1 transformation type.");
	}


	if(errors[0]){
		el('postchapter-errors').innerHTML='<b>Please correct the following errors:</b><br/>';
		for(i=0; i<errors.length; i++){
			el('postchapter-errors').innerHTML+=errors[i]+'<br/>';
		}
		window.location.hash="postchapter-errors";
	}else{
		window.removeEventListener('beforeunload', warnOnLeaving, false);
	}

	return (errors.length==0);
}



function showAllPages(pack){
	document.querySelectorAll('.page-nav .show-all-pages-'+pack)[0].style.display='none';

	var allPages=document.querySelectorAll('.page-nav .hidden-page-'+pack);
	for(var i=0; i<allPages.length; i++){
		allPages[i].style.display='inline-block';
	}
}
function warnOnLeaving(evt){
	evt = evt || window.event;

	// For IE and Firefox prior to version 4
	if(evt){
		evt.returnValue = true;
	}

	// For Safari
	return 'Your changes will be lost.';
}


function enableWarnOnLeaving(){
	addEvent(window, 'beforeunload', warnOnLeaving);
}




function updateAdultIcon(){
	var adult=el('adult').value;
	if(adult === "0"){
		adult=false;
	}
	var violence=el('checkbox-violence').checked;

	var className='sprite sprite-adult ';

	if(adult || violence){
		className+=' adult';
		if(adult){
			className+='-'+adult;
		}
		if(violence){
			className+='-v';
		}
	}

	el('edit-adult-icon').className=className;
	el('edit-adult-icon').dataTitle=CYOC.KEY[adult];
}

function setChoice(c){
	if(c==0){
		el('option_title').value='';
		el('option_title').readOnly=false;
		hide('reset-option');
	}else{
		var title=el('suggested_'+c).innerHTML;
		el('option_title').value=title.replace(/\"/g, '&quot;');
		el('option_title').readOnly=true;
		el('reset-option').style.display='inline';
	}
	el('suggested-title').value=c;
	window.location.hash="write-chapter";
}

function getOptionInput(e){
	var id=parseInt(e.id.replace(/^option_/, ""));
	return el('optioninput_'+id);
}
function updateChoices(){
	var MAX_CHOICES=30;

	var lis=el('suggested-options').children;

	for(var i=0; i<lis.length; i++){
		if(getOptionInput(lis[i]).value == '' && i < lis.length-1){
			el('suggested-options').removeChild(lis[i]);

			if(/MSIE/.test(navigator.userAgent)){//IE sucks
				setTimeout(function(){el('textarea-chapterText').focus();}, 10);
			}else{
				getOptionInput(lis[i]).focus();
			}
		}
	}

	if(lis.length<MAX_CHOICES && (lis.length==0 || getOptionInput(lis[lis.length-1]).value!='')){
		var lastEmptyOption;
		if(lis.length>0){
			lastEmptyOption=parseInt(lis[lis.length-1].id.replace(/^option_/, ""))+1;
		}else{
			lastEmptyOption=0;
		}

		var newLi = document.createElement('li');
		newLi.setAttribute('id', 'option_'+lastEmptyOption);
		newLi.innerHTML = '<input type="text" onkeyup="updateChoices();" onblur="updateChoices();" id="optioninput_'+lastEmptyOption+'" maxlength="100" class="option" value="" name=\"newoptions[]\"/>';
		el('suggested-options').appendChild(newLi);
	}
}


function toggleBranchLink(e){
	if(/chapter_(\d+)\.html$/.test(e.href)){
		e.href=e.href.replace(/chapter_(\d+)\.html$/, 'chapter_$1/branch_$1.html');
	}else{
		e.href=e.href.replace(/\/branch_(\d+)\.html$/, '.html');
	}
}
function toggleBranchLinks(){
	var subchapters=document.querySelectorAll('#subchapters a');
	for(var i=0; i<subchapters.length; i++){
		toggleBranchLink(subchapters[i]);
	}
	toggleBranchLink(el('previouschapterlink'));
}

function toggleBranch(chapterId, branchId){
	if(!el('branch')){
		var div=document.createElement('div');
		div.id='branch';
		div.innerHTML='Loading...';
		document.body.appendChild(div);
		sendAjax('chapter='+chapterId+'&branch='+branchId);
		el('button-toggle-branch').className='selected';
	}else{
		if(el('branch').style.display === 'none'){
			show('branch');
			toggleBranchLinks();
			el('button-toggle-branch').className='selected';
		}else{
			hide('branch');
			toggleBranchLinks();
			el('button-toggle-branch').className='';
		}
	}
}

function toggleFull(chapterId){
	if(el('full').innerHTML === ''){
		el('full').innerHTML='Loading...';
		sendAjax('full='+chapterId);
		el('button-toggle-full').className='selected';
	}else{
		if(el('full').style.display === 'none'){
			show('full');
			el('button-toggle-full').className='selected';
		}else{
			hide('full');
			el('button-toggle-full').className='';
		}
	}
}

var faving=0;
function toggleFav(chapterId){
	if(!faving){
		faving=1;
		el('togglefavbutton').children[0].className='fa fa-spinner fa-pulse';
		sendAjax('fav='+chapterId);
	}
}

var following=0;
function toggleFollow(userId){
	if(!following){
		following=1;
		el('togglefolbutton').children[0].className='fa fa-spinner fa-pulse';
		sendAjax('follow='+userId);
	}
}

var responseXML=0;
/* Ajax */
function sendAjax(params) {
	var req = this.xmlHttpReq;

	if(window.XMLHttpRequest){
		req = new XMLHttpRequest();
	}else if(window.ActiveXObject){ //IE
		req = new ActiveXObject('Microsoft.XMLHTTP');
	}
	req.open('POST', '/interactives/quickactions.php', true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.onreadystatechange = function() {
		if (req.readyState == 4){
			if(req.status==200){
				if(/branch=/.test(params)){
					el('branch').innerHTML=req.responseText;
					toggleBranchLinks();
				}else if(/full=/.test(params)){
					el('full').innerHTML=req.responseText;
				}else if(/fav=/.test(params)){
					faving=0;
					el('togglefavbutton').innerHTML=req.responseText;
					var className=/fa fa-star-o/.test(req.responseText)?'':'enabled';
					el('togglefavbutton').className='toggleajaxbutton '+className;
				}else if(/follow=/.test(params)){
					following=0;
					el('togglefolbutton').innerHTML=req.responseText;
					var className=/fa fa-circle-o/.test(req.responseText)?'':'enabled';
					el('togglefolbutton').className='toggleajaxbutton '+className;
				}else if(/getstoryname=/.test(params)){
					if(req.responseText!=='0'){
						CYOCSearch.setStory(params.replace(/[^\d]/g,''), req.responseText);
					}else{
						CYOCSearch.setStory(false);
					}
				}else if(/getauthorname=/.test(params)){
					if(req.responseText!=='0'){
						CYOCSearch.setAuthor(params.replace(/[^\d]/g,''), req.responseText);
					}else{
						CYOCSearch.setAuthor(false);
					}
				}else if(/home=/.test(params)){
					CYOC.lastUpdate+=3;
					var div=document.createElement('div');
					div.innerHTML=req.responseText;
					el('last-updates').appendChild(div);
				}
			}else{
				alert('error');
			}
		}
	}
	req.send(params);
}

function toggleSearch(){
	if(el('button-search').className!=='selected'){
		el('search-panel').className='visible';
		el('button-search').className='selected';
		el('input-q').focus();
	}else{
		el('search-panel').className='';
		el('button-search').className='';
	}
}


/* Startup */
addEvent(window, 'load', function(){	
	if(el('suggested-options')){
		updateChoices();

		for(var i=0; i<3; i++){
			var inputTag=el('input-tag'+i);
			addTagEvent(inputTag);
		}
	}

	if(el('edit-adult-icon'))
		updateAdultIcon();

	if(document.querySelector('.chapter-list')){
		var as=document.querySelectorAll('.chapter-list a');
		for(var i=0;i<as.length;i++){
			addEvent(as[i],'click',stopPropagation);
		}
	}

	CYOC.tooltip=document.createElement('div');
	CYOC.tooltip.className='balloon';
	document.body.appendChild(CYOC.tooltip);

	addCommonTooltip(document.querySelectorAll('span.tags abbr.l,span.tags abbr.pics,span.sprite-adult'));
	addCommonTooltip(document.querySelectorAll('.chapters i.fa-level-up'), 'Previous chapter');

	CYOCSearch.initialize();

	addEvent(el('button-search'), 'click', stopPropagation);

	addEvent(window,'resize',resizeWindow);
	resizeWindow();
});

function toggleMiniMenu(){
	if(/visible/.test(el('menu').className)){
		el('menu').className='';
	}else{
		el('menu').className='visible';
	}
}
function addCommonTooltip(elems, text){
	for(var i=0;i<elems.length;i++){
		elems[i].dataTitle=text || elems[i].title;
		elems[i].title='';
		addEvent(elems[i], 'mouseover', tooltipOpen);
		addEvent(elems[i], 'mouseout', tooltipClose);
	}
}


function tooltipOpen(){
	CYOC.tooltip.innerHTML=this.dataTitle;
	CYOC.tooltip.className='balloon open';

	var doc=document.documentElement;
	var left=(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	var top=(window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

	var rect=this.getBoundingClientRect();
	var tooltipRect=CYOC.tooltip.getBoundingClientRect();

	CYOC.tooltip.style.top=parseInt(rect.top+top+this.offsetHeight)+'px';
	CYOC.tooltip.style.left=parseInt(rect.left+left-parseInt((CYOC.tooltip.offsetWidth-this.offsetWidth)/2))+'px';
}
function tooltipClose(){
	CYOC.tooltip.className='balloon';
}



function hideWarning(){
	hide('warning-message');
	show('div-submit-chapter');
	setCookie('hideWarning',1,3);
}

function getMoreRecentUpdates(){
	sendAjax('home='+CYOC.lastUpdate);
}


/* libs */
var Dialogs=function(){function e(e,t,n){r?e.attachEvent("on"+t,n):e.addEventListener(t,n,!1)}function t(){u--,d()}function n(){u>=0&&t()}function l(e){for(var t=0;t<e.dialogElements.length;t++){var n=e.dialogElements[t];if("INPUT"===n.nodeName&&"hidden"!==n.type||"INPUT"!==n.nodeName)return window.setTimeout(function(){n.focus()},1),!0}return!1}function a(e){e.style.marginLeft="-"+parseInt(e.offsetWidth/2)+"px",e.style.marginTop="-"+parseInt(e.offsetHeight/2)-30+"px"}function o(){for(var e=0;document.getElementById("dialog-quick"+e);)-1===f.indexOf(document.getElementById("dialog-quick"+e))&&document.body.removeChild(document.getElementById("dialog-quick"+e)),e++}function i(e,t){for(var n=0;n<e.dialogElements.length;n++)e.dialogElements[n].disabled=t}function d(){if(-1===u){m.className="dialog-overlay";for(e=0;e<f.length;e++)f[e].className=f[e].className.replace(/ active/g,"");window.setTimeout(o,2500)}else{m.className="dialog-overlay active";for(e=0;e<u;e++)f[e].style.zIndex=s-(u+e),i(f[e],!0);for(e=0;e<16;e++)a(f[u]);f[u].className=f[u].className.replace(/ active/g,"")+" active",f[u].style.zIndex=s+1,i(f[u],!1);for(var e=u+1;e<f.length;e++)f[e].className=f[e].className.replace(/ active/g,""),i(f[e],!0);l(f[u])}}function c(t,l){var a=document.createElement("div");a.className="dialog";for(var o=0;document.getElementById("dialog-quick"+o);)o++;a.id="dialog-quick"+o;var i=document.createElement("div");i.style.textAlign="center",i.innerHTML=t,a.appendChild(i);var d=document.createElement("div");if(d.className="dialog-buttons",l){(r=document.createElement("button")).className="colored accept",r.innerHTML="Accept",e(r,"click",l);var c=document.createElement("button");c.innerHTML="Cancel",e(c,"click",n),d.appendChild(r),d.appendChild(c)}else{var r=document.createElement("button");r.className="colored accept",r.innerHTML="Accept",e(r,"click",n),d.appendChild(r)}a.appendChild(d),document.body.appendChild(a);var l=function(){Dialogs.open(a)};g?g(l):window.setTimeout(l,1)}var r=/MSIE 8/.test(navigator.userAgent),s=9e3,m=document.createElement("div");m.className="dialog-overlay",m.style.position="fixed",m.style.top="0",m.style.left="0",m.style.width="100%",m.style.height="100%",m.style.zIndex=s,e(m,"click",n),e(window,"load",function(){document.body.appendChild(m)});var u=-1,f=[],g=window.mozRequestAnimationFrame||window.requestAnimationFrame;return e(window,"resize",function(){for(var e=0;e<f.length;e++)a(f[e]),a(f[e])}),e(document,"keydown",function(e){if(f.length&&u>=0)if(27==e.keyCode)e.preventDefault?e.preventDefault():e.returnValue=!1,n();else if(9==e.keyCode){var t=f[u];t.dialogElements[t.dialogElements.length-1]===document.activeElement&&(e.preventDefault?e.preventDefault():e.returnValue=!1,l(t))}}),{open:function(e){var t="string"==typeof e?document.getElementById("dialog-"+e.replace(/^#/,"").replace(/^dialog-/,"")):e;if(t.style.position="fixed",t.style.top="50%",t.style.left="50%",t.style.zIndex=parseInt(m.style.zIndex)+1,!t.dialogElements){t.dialogElements=t.querySelectorAll("input,textarea,select,button");for(var n=0;n<t.dialogElements.length;n++)t.dialogElements[n].tabIndex||(t.dialogElements[n].tabIndex=0)}f[++u]=t,d()},close:n,closeAll:function(){u=-1,d()},alert:function(e){c(e)},confirm:function(e,t){c(e,t)}}}();