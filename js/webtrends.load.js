
window.webtrendsAsyncInit=function(){ 
	var dcs=new Webtrends.dcs().init({ 
		dcsid:"dcs4fulp900000sx0x9l64vsp_7x3e",
		domain:"wtrace.bj.chinamobile.com", 
		timezone:8, 
		i18n:true, 
		fpcdom:".10086.cn", 
		fpc:"WT_FPC",
		metanames: "",
		paidsearchparams: "gclid,ad_id",
		adimpressions:true,
		adsparam:"WT.ac",
		dcsdelay: 500,
	});

	dcs.WT.branch="web";
	dcs.track();

};

(function(){ 
var s=document.createElement("script"); s.async=true; s.src="http://epay.bj.chinamobile.com/internetFee_new/jsp/payment_h5pages/js/webtrends.min.js"; 
var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2); 
}()); 

