//字数限制
function textCount(obj)
{
	   $(obj).next().find(".textcount-num").text($(obj).val().length);
}