function show_addList(){
	$("#addList").show();
}

function hide_addList(){
	$("#addList").hide();
}

function show_cover(){
	$("#cover").show();
}

function hide_cover(){
	$("#cover").hide();
}

function addList(){
	show_addList();
	show_cover();
}

function no_addList(){
	hide_addList();
	hide_cover();
}

function removeList(id,list){
	location.href = "/removeList?id="+id+"&list="+list;
}

function updateThing(title,message,time,urgent,id){
	document.getElementById("title").value = title;
	document.getElementById("message").value = message;
	document.getElementById("year").value = time.substring(0,4);
	document.getElementById("month").value = time.substring(5,7);
	document.getElementById("day").value = time.substring(8,10);
	document.getElementById("urg"+urgent).checked = "checked";
	if(document.getElementById("myform").action.indexOf("update") == -1)
		document.getElementById("myform").action += ("&update="+id);
}

