//Init global properties 

(function(){
        //override array hari untuk axis x
        d3_time_weekdays = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
        
        //gc (Global Config) Properties & Tools
        var gc = {
            timeUnit: 'perday',//default time unit
            toggleTimeUnit: function(unit) { 
                    if(this.timeUnit!=unit){
                        if(unit=='perday' || unit=='perhour'){
                            this.timeUnit = unit;
                        }else{
                            var msg = 'Error toggleAtom. Param atom:'+atom+' instead of perday/perhour';
                            gc.infoError(msg, false);
                        }
                    }
                },
            defaultUbahRentang: '#datepick',
            domainOrientasi: ['negatif', 'positif', 'nonopini'],
            colorOrientasi: d3.scale.ordinal().range(['#FF0000', '#009900', '#FAA732']),
            parseJam: d3.time.format('%Y-%m-%d %H').parse,
            parseTanggal: d3.time.format('%Y-%m-%d').parse,
            addtop: function(){ return gc.timeUnit == 'perday' ? 100 : 10;},
            //addtop penambahan supaya line tidak menyentuh pojok atas chart
            nama_bulan : ["0","Januari", "Februari", "Maret", 
                "April", "Mei", "Juni", "Juli", "Agustus", "September", 
                "Oktober", "November", "Desember"],
            duration: [100, 200, 500, 1000, 1500], 
            delay: [100,500, 1000],
            getTweetUrl: 'data/getTweets.php',
            getKeywUrl: 'data/getKeyword.php',
            getBarUrl: 'data/barchartjson.php',
            getDateListUrl: 'data/datelist.php',
            getPieData: 'data/getKeyword.php?track=count',
            getLineUrl: 'data/linecsv.php',
            format: d3.format(',.0f'),
            blurEffect: 15,
            translate: function(horizontal, vertical){
                return 'translate('+horizontal+','+vertical+')';
                },
            orderArray: function(T){
                return [T[0], T[2], T[1]];
                },
            dateList: 0,
            dateSize: 0,
            firstDate: 0,
            lastDate: 0,
            rentangFirstDate: 0,
            rentangLastDate: 0,
            strFirstDate: "",
            strLastDate: "",
            tog : [ { orn: "negatif",eye: "#negeye", id: "#toggleNegatif", view : true},
                    { orn: "positif",eye: "#poseye", id: "#togglePositif", view : true},
                    { orn: "nonopini",eye: "#noneye", id: "#toggleNonopini", view : true} ],
            infoError: function(msg, isAlert){
                if(isAlert){
                    alert(msg);
                    return true;
                }else{
                    console.log(msg);
                    return true;
                }
            },
            progressInfo: ['Failed to load!', '10%..','20%..','30%..','40%..','50%..',
                            '60%..','70%..','80%..','90%..','100%','Complete.','Please Wait...'],
            rentangHide: false,
            format: d3.format(',.0f'),
            formatPercent: d3.format(".0%"),
            perdayTips: [],
            perhourTips: [],
            isPerdayTipsExist: false,
            isPerhourTipsExist: false,
            circleTipHideDelay: 3.5,
            totalNegatif: 0,
            totalPositif: 0,
            totalNonopini: 0,
            jsondataset: 0,
            jsonbigneg: 0,
            jsonbigpos: 0,
            jsonbignon: 0,
            loadingGIF: '<img src=\'img/black-020-loading.gif\'/>'
        };
        
        
        //load json peringkat keyword
        queue().defer(d3.json, 'http://localhost/vis/data/getKeyword.php?track=big&or=dataset')
                .defer(d3.json, 'http://localhost/vis/data/getKeyword.php?track=big&or=negatifbig')
                .defer(d3.json, 'http://localhost/vis/data/getKeyword.php?track=big&or=positifbig')
                .defer(d3.json, 'http://localhost/vis/data/getKeyword.php?track=big&or=nonopinibig')
                .await(collect);
                
       function collect(error, jsons) {
                function sortdesc(ar) {
                    return ar.sort(function(a,b) {
                            return b.val - a.val;
                        });
                }
           if(error) return gc.infoError('failed getting json files', true);
           gc.jsondataset = sortdesc(jsons[0]);
           gc.jsonbigneg = sortdesc(jsons[1]);
           gc.jsonbigpos = sortdesc(jsons[2]);
           gc.jsonbignon = sortdesc(jsons[3]);
           
       } 
            
        // DatePicker range Date
        function initDatePicker(){
             $("#calDate1").datepicker("option", "minDate", gc.firstDate);
             $("#calDate1").datepicker("option", "maxDate", gc.lastDate);
             $("#calDate2").datepicker("option", "minDate", gc.firstDate);
             $("#calDate2").datepicker("option", "maxDate", gc.lastDate);
        }
        
        //Assign color scale domain 
        gc.colorOrientasi.domain(gc.domainOrientasi);
        
        function vizconfig() {
            this.width = 0;
            this.height = 0;
            this.margin = [];
            this.xScale = function(){};
            this.yScale =  function(){};
        };
        
        
            
        //export   
        window.gc = gc;
        window.vizconfig = vizconfig;
        window.initDatePicker = initDatePicker;  
})();

$(function() {
   var myPie = $("#pie");
   var pieOpentip = new Opentip(myPie, {showOn: "mouseover",
                                        showEffect: "fade",
                                        tipJoint: "bottom left",
                                        style: "glass",
                                        borderRadius: 1,
                                        escapeContent: false,
                                        borderWidth: 3,
                                        borderColor: "#317cc5",
                                        fixed: false});
   
   gc.pieTip = pieOpentip; 
   
   Opentip.styles.circ = {
       extends: 'glass',
       ajax: false,
       showOn: null,
       delay: 0.5,
       tipJoint: 'bottom left',
       target: true,
       fixed: true,
       borderWidth: 1.5,
       hideDelay: gc.circleTipHideDelay,
       group: 'circles'
   } 
});

//FULSCREEN API
(function() {
    var
        fullScreenApi = {
            supportsFullScreen: false,
            isFullScreen: function() { return false; },
            requestFullScreen: function() {},
            cancelFullScreen: function() {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');
 
    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
            fullScreenApi.prefix = browserPrefixes[i];
 
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                fullScreenApi.supportsFullScreen = true;
 
                break;
            }
        }
    }
 
    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
 
        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function(el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }
 
    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function() {
 
            return this.each(function() {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
    }
 
    // export api
    window.fullScreenApi = fullScreenApi;
})();



function initjs() {
    
    
    // TODO: Kumpulin semua click listener dari jquery
    $('input.deletable').wrap('<span class="deleteicon" />').after($('<span/>').click(function() {
        resetbgkeyword();
        $(this).prev('input').val('').focus();
    }));


$('#toggleNegatif').click(function() {
toggleLine('negatif');
if (gc.tog[0].view) {
$(gc.tog[0].eye).attr('class', 'icon-eye-close');
gc.tog[0].view = false;
}else {
$(gc.tog[0].eye).attr('class', 'icon-eye-open');
gc.tog[0].view = true;
}
isAlone();
});
$('#togglePositif').click(function() {
toggleLine('positif');
if (gc.tog[1].view) {
$(gc.tog[1].eye).attr('class', 'icon-eye-close');
gc.tog[1].view = false;
}else {
$(gc.tog[1].eye).attr('class', 'icon-eye-open');
gc.tog[1].view = true;
}
isAlone();
});
$('#toggleNonopini').click(function() {
toggleLine('nonopini');
if (gc.tog[2].view) {
$(gc.tog[2].eye).attr('class', 'icon-eye-close');
gc.tog[2].view = false;
}else {
$(gc.tog[2].eye).attr('class', 'icon-eye-open');
gc.tog[2].view = true;
}
isAlone();
});

function isAlone() {
var countrue = 0;
var alone = 0;
for (i = 0; i < gc.tog.length; i++) {
if (gc.tog[i].view == true) {
countrue++;
}
}
if (countrue == 1) {
for (i = 0; i < gc.tog.length; i++) {
if (gc.tog[i].view == true) {
$(gc.tog[i].id).attr('disabled', '');
toggleMaxY(gc.tog[i].orn);
}
}
}
if (countrue > 1) {
$('#viewcontrols button').removeAttr('disabled');
toggleMaxY('default');
}
};

$('#searchkeyword').keypress(function(k) {
if (k.which == 13) {
var key = $('#searchkeyword').val();
if (key != '') {
searchkeyword(key, false);
resultkeyword(key);
}

return false;
}
});


    $('#zoombutton').click(function() {
        var msg = "Menggunakan context saat visualisasi jumlah keyword berjalan dapat melambatkan respon line chart. Lanjutkan?";    
        if (!$("#context").is(":visible") && keywordchart.rects != null) {
            if(confirm(msg)){
                $('#context').slideToggle(250, unzoom);
            } else {
                $("#zoombutton").removeClass("active");
                return null;
            }
        } else {
            $('#context').slideToggle(250, unzoom);
        }      
    });


$('#settingRentang').click(function() {

$('.tampilsetting').slideToggle(250);
if ($('#ubahRentang').attr('disabled') == null) {
$('#ubahRentang').attr('disabled', '');
}else {
$('#ubahRentang').removeAttr('disabled');
}

});


$('#setSlider').click(function() {

    gc.defaultUbahRentang = '#slidepick';
    var isactive = $('#setSlider').attr('class');
    if (isactive.indexOf('active') != -1) {
    $('#setSlider').attr('class', isactive);
    }else {
    $('#setSlider').attr('class', isactive + ' active');
    }
    var set = $('#setDatepick').attr('class').replace('active', '');
    $('#setDatepick').attr('class', set);
    
    $('#datepick').hide('slow');
    $('#slidepick').show('slow');
    //$("#ubahslider").removeAttr("disabled");
    //$(".tampilsetting").slideToggle(250);
});

$('#setDatepick').click(function() {
gc.defaultUbahRentang = '#datepick';
var isactive = $('#setDatepick').attr('class');
if (isactive.indexOf('active') != -1) {
$('#setDatepick').attr('class', isactive);
}else {
$('#setDatepick').attr('class', isactive + ' active');
}
var set = $('#setSlider').attr('class').replace('active', '');
$('#setSlider').attr('class', set);
$('#slidepick').hide('slow');
$('#datepick').show('slow');
//$("#ubahslider").removeAttr("disabled");
//$(".tampilsetting").slideToggle(250);
});


$('#ubahRentang').click(function() {
rentangEye();    
$(gc.defaultUbahRentang).slideToggle(250);	
});

function rentangEye(){
if ($("#datepick").is(":visible") || $("#slidepick").is(":visible") ) {
    $("#rentangeye").attr('class', 'icon-eye-close');
    if ($('#settingRentang').attr('disabled') == null) {
        $('#settingRentang').attr('disabled', '');
    }else {
        $('#settingRentang').removeAttr('disabled');
    }
    return null;
}else {
    $("#rentangeye").attr('class', 'icon-eye-close');
    if ($('#settingRentang').attr('disabled') == null) {
        $('#settingRentang').attr('disabled', '');
    }else {
        $('#settingRentang').removeAttr('disabled');
    }
    $("#rentangeye").attr('class', 'icon-eye-open');
    return null;
}
}

$('#calDate1').datepicker({
dateFormat: 'yy-mm-dd',
numberOfMonths: 2,
onSelect: function(selectedDate ) {
$('#calDate2').datepicker('option', 'minDate', selectedDate);
}
});

$('#calDate2').datepicker({
dateFormat: 'yy-mm-dd',
numberOfMonths: 2,
onSelect: function(selectedDate ) {
$('#calDate1').datepicker('option', 'maxDate', selectedDate);
}
});

$("#overviewinfo").click(function() {
    
    $("#modaloverview").modal('show');
});

$('#fullkeyword').click(function() {
topTweet(this);
});

initbarchart();
initLineChart('perday', false);
//initSlider();
setTimeout('initDatePicker()',3000);
//$("#modaloverview").modal('show');
//searchkeyword('pakai',true);
              
}







