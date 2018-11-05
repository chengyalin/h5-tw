
document.oncontextmenu=new Function("event.returnValue=false;");
document.onselectstart=new Function("event.returnValue=false;");

if(IFWECHAT || IFSAFARI){
	var isPageHide = false; 
	window.addEventListener('pageshow', function () { 
	    if (isPageHide) { 
	      window.location.reload(); 
	    } 
	}); 
	window.addEventListener('pagehide', function () { 
	    isPageHide = true; 
	});
};



var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cspan id='cnzz_stat_icon_1264331570'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s22.cnzz.com/z_stat.php%3Fid%3D1264331570' type='text/javascript'%3E%3C/script%3E"));

/*
! function(a, b) {

if(!b.__SV) {

var c, d, e, f;

window.dplus = b, b._i = [], b.init = function(a, c, d) {

function g(a, b) {

var c = b.split(".");

2 == c.length && (a = a[c[0]], b = c[1]), a[b] = function() {

a.push([b].concat(Array.prototype.slice.call(arguments, 0)))

}

}

var h = b;

for("undefined" != typeof d ? h = b[d] = [] : d = "dplus", h.people = h.people || [], h.toString = function(a) {

var b = "dplus";

return "dplus" !== d && (b += "." + d), a || (b += " (stub)"), b

}, h.people.toString = function() {

return h.toString(1) + ".people (stub)"

}, e = "disable track track_links track_forms register unregister get_property identify clear set_config get_config get_distinct_id track_pageview register_once track_with_tag time_event people.set people.unset people.delete_user".split(" "), f = 0; f < e.length; f++) g(h, e[f]);

b._i.push([a, c, d])

}, b.__SV = 1.1, c = a.createElement("script"), c.type = "text/javascript", c.charset = "utf-8", c.async = !0, c.src = "//w.cnzz.com/dplus.php?id=1264331570", d = a.getElementsByTagName("script")[0], d.parentNode.insertBefore(c, d)

}

}(document, window.dplus || []), dplus.init("1264331570");

*/

var _czc = _czc || [];
//同盾

var _fmOpt = {};
(function() {
    _fmOpt = {
        partner: 'tanwu',
        appName: 'tanwu_web',
        token: 'tanwu' + "-" + new Date().getTime() + "-"+ Math.random().toString(16).substr(2),
        fmb: true,
        getinfo: function(){
            return "e3Y6ICIyLjUuMCIsIG9zOiAid2ViIiwgczogMTk5LCBlOiAianMgbm90IGRvd25sb2FkIn0=";
        }                            };

    var cimg = new Image(1,1);
    cimg.onload = function() {
        _fmOpt.imgLoaded = true;
    };
    cimg.src = "https://fp.fraudmetrix.cn/fp/clear.png?partnerCode=tanwu&appName=tanwu_web&tokenId=" + _fmOpt.token;
    var fm = document.createElement('script'); fm.type = 'text/javascript'; fm.async = true;
    fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.fraudmetrix.cn/v2/fm.js?ver=0.1&t=' + (new Date().getTime()/3600000).toFixed(0);
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fm, s);
})();
/*
var _mtac = {"performanceMonitor":1};
(function() {
	var mta = document.createElement("script");
	mta.src = "http://pingjs.qq.com/h5/stats.js?v2.0.4";
	mta.setAttribute("name", "MTAH5");
	mta.setAttribute("sid", "500603910");
	mta.setAttribute("cid", "500604699");
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(mta, s);
})();
*/