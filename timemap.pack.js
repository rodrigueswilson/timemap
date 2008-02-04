/*----------------------------------------------------------------------------
 * @author Nick Rabinowitz (www.nickrabinowitz.com)
 * Dependencies: Google Maps API v2, SIMILE Timeline v1.2
 * Thanks to J�rn Clausen (http://www.oe-files.de) for initial concept and code
 *---------------------------------------------------------------------------*/

function TimeMap(a,b,c){this.mElement=b;this.tElement=a;this.datasets={};this.mapBounds=new GLatLngBounds;this.settings={syncBands:"syncBands"in c?c.syncBands:true,mapCenter:"mapCenter"in c?c.mapCenter:new GLatLng(0,0),mapZoom:"mapZoom"in c?c.mapZoom:4,mapType:"mapType"in c?c.mapType:G_PHYSICAL_MAP,showMapTypeCtrl:"showMapTypeCtrl"in c?c.showMapTypeCtrl:true,showMapCtrl:"showMapCtrl"in c?c.showMapCtrl:true,hidePastFuture:"hidePastFuture"in c?c.hidePastFuture:true,hideOffMap:"hideOffMap"in c?c.hideOffMap:false,centerMapOnItems:"centerMapOnItems"in c?c.centerMapOnItems:true};var d=this.settings;if(GBrowserIsCompatible()){this.map=new GMap2(this.mElement);if(d.showMapCtrl)this.map.addControl(new GLargeMapControl);if(d.showMapTypeCtrl)this.map.addControl(new GMapTypeControl);this.map.addMapType(G_PHYSICAL_MAP);this.map.removeMapType(G_HYBRID_MAP);this.map.enableDoubleClickZoom();this.map.enableScrollWheelZoom();this.map.enableContinuousZoom();this.map.setCenter(d.mapCenter,d.mapZoom);this.map.setMapType(d.mapType)}var e=this.map;Timeline.DurationEventPainter.prototype._showBubble=function(a,b,c){GEvent.trigger(c.placemark,"click")}}TimeMap.prototype.createDataset=function(a,b){if(!("title"in b))b.title=a;var c=new TimeMapDataset(this,b);this.datasets[a]=c;return c};TimeMap.prototype.initTimeline=function(a){for(var b=1;b<a.length;b++){if(this.settings.syncBands)a[b].syncWith=b-1;a[b].highlight=true}this.timeline=Timeline.create(this.tElement,a);if(this.settings.hidePastFuture){var c=this.timeline.getBand(0);var d=this.datasets;var e=this.map;c.addOnScrollListener(function(){var a=c.getMaxVisibleDate().getTime(),b=c.getMinVisibleDate().getTime();for(id in d){var e=d[id].getItems();for(var f=0;f<e.length;f++)if(e[f].event!=null){var g=e[f].event.getStart().getTime();var h=e[f].event.getEnd().getTime();if(g>a){e[f].placemark.hide();e[f].closeInfoWindow()}else if(h<b||e[f].event.isInstant()&&g<b){e[f].placemark.hide();e[f].closeInfoWindow()}else e[f].placemark.show()}}})}if(this.settings.hideOffMap){var d=this.datasets;var e=this.map;GEvent.addListener(e,"moveend",function(){var a=e.getBounds();for(id in d){var b=d[id].getItems();for(var c=0;c<b.length;c++){var f=b[c].placemark.getLatLng();if(!a.containsLatLng(f)&&b[c].event!=null)b[c].event.hide();else b[c].event.show()}}})}resizeTimerID=null;var f=this.timeline;window.onresize=function(){if(resizeTimerID==null)resizeTimerID=window.setTimeout(function(){resizeTimerID=null;f.layout()},500)}};TimeMap.prototype.createLegend=function(a){a="#"+a;for(id in this.datasets){var b=this.datasets[id];var c='<div style="float:left;margin-right:5px;border:1px solid #000;width:12px;height:12px;background:'+b._theme.color+'">&nbsp;</div>';var d='<div class="legenditem">'+c+b.title+"</div>";$(a).append(d)}};function TimeMapDataset(a,b){this.timemap=a;this.eventSource=new Timeline.DefaultEventSource;this._items=[];this.title="title"in b?b.title:"";this._theme="theme"in b?b.theme:new TimeMapDatasetTheme({})}TimeMapDataset.prototype.getItems=function(){return this._items};TimeMapDataset.prototype.loadItems=function(a,b){for(var c=0;c<a.length;c++)this.loadItem(a[c],b);var d=this.timemap;if(d.settings.centerMapOnItems){d.map.setZoom(d.map.getBoundsZoomLevel(d.mapBounds));d.map.setCenter(d.mapBounds.getCenter())}};TimeMapDataset.prototype.loadItem=function(a,b){if(b!=undefined)a=b(a);if(a==null)return;var c=this.timemap,d=a.start==undefined||a.start==""?null:Timeline.DateTime.parseIso8601DateTime(a.start),e=a.end==undefined||a.end==""?null:Timeline.DateTime.parseIso8601DateTime(a.end),f=a.end==undefined,g=f?this._theme.eventIcon:null,h=a.title;if(d!=null)var i=new Timeline.DefaultEventSource.Event(d,e,null,null,f,h,null,null,null,g,this._theme.eventColor,null);else var i=null;var j=null,k="",l=null;if("point"in a){l=new GLatLng(parseFloat(a.point["lat"]),parseFloat(a.point["lon"]));if(c.settings.centerMapOnItems)c.mapBounds.extend(l);j=new GMarker(l,{icon:this._theme.icon});k="marker"}else if("polyline"in a||"polygon"in a){var m=[];if("polyline"in a)var n=a.polyline;else var n=a.polygon;for(var o=0;o<n.length;o++){l=new GLatLng(parseFloat(n[o]["lat"]),parseFloat(n[o]["lon"]));m.push(l);if(c.settings.centerMapOnItems)c.mapBounds.extend(l)}if("polyline"in a){j=new GPolyline(m,this._theme.lineColor,this._theme.lineWeight,this._theme.lineOpacity);k="polyline"}else{j=new GPolygon(m,this._theme.polygonLineColor,this._theme.polygonLineWeight,this._theme.polygonLineOpacity,this._theme.fillColor,this._theme.fillOpacity);k="polygon"}}if(k=="marker")l=j.getLatLng();else if(k=="polyline")l=j.getVertex(Math.floor(j.getVertexCount()/2));else if(k=="polygon")l=j.getBounds().getCenter();var p="options"in a?a.options:{};p["title"]=h;p["type"]=k;p["infoPoint"]=l;var q=new TimeMapItem(j,i,c.map,p);if(i!=null){i.placemark=j;i.item=q}j.event=i;j.item=q;this._items.push(q);var r=c.map;GEvent.addListener(j,"click",function(){q.openInfoWindow()});c.map.addOverlay(j);if(i!=null)this.eventSource.add(i)};TimeMapDataset.parseKML=function(a){var b=[];kmlnode=GXml.parse(a);var c=kmlnode.getElementsByTagName("Placemark");for(var d=0;d<c.length;d++){var e=c[d];var f,g={};f=e.getElementsByTagName("name");if(f.length>0)g["title"]=f[0].firstChild.nodeValue;f=e.getElementsByTagName("description");g["options"]={};if(f.length>0)g["options"]["description"]=f[0].firstChild.nodeValue;f=e.getElementsByTagName("TimeStamp");if(f.length>0)g["start"]=f[0].getElementsByTagName("when")[0].firstChild.nodeValue;if(!g["start"]){f=e.getElementsByTagName("TimeSpan");if(f.length>0){g["start"]=f[0].getElementsByTagName("begin")[0].firstChild.nodeValue;g["end"]=f[0].getElementsByTagName("end")[0].firstChild.nodeValue}}f=e.getElementsByTagName("Point");if(f.length>0){g["point"]={};var h=f[0].getElementsByTagName("coordinates")[0].firstChild.nodeValue;var i=h.split(",");g["point"]={lat:trim(i[1]),lon:trim(i[0])}}else{f=e.getElementsByTagName("LineString");if(f.length>0){g["polyline"]=[];var h=f[0].getElementsByTagName("coordinates")[0].firstChild.nodeValue;var j=trim(h).split(/[\r\n\f]+/);for(var k=0;k<j.length;k++){var i=j[k].split(",");g["polyline"].push({lat:trim(i[1]),lon:trim(i[0])})}}else{f=e.getElementsByTagName("Polygon");if(f.length>0){g["polyline"]=[];var h=f[0].getElementsByTagName("coordinates")[0].firstChild.nodeValue;var j=trim(h).split(/[\r\n\f]+/);for(var k=0;k<j.length;k++){var i=j[k].split(",");g["polyline"].push({lat:trim(i[1]),lon:trim(i[0])})}}}}b.push(g)}return b};function TimeMapDatasetTheme(a){this.icon="icon"in a?a.icon:G_DEFAULT_ICON;this.color="color"in a?a.color:"#FE766A";this.lineColor="lineColor"in a?a.lineColor:this.color;this.polygonLineColor="polygonLineColor"in a?a.polygonLineColor:this.lineColor;this.lineOpacity="lineOpacity"in a?a.lineOpacity:1;this.polgonLineOpacity="polgonLineOpacity"in a?a.polgonLineOpacity:this.lineOpacity;this.lineWeight="lineWeight"in a?a.lineWeight:2;this.polygonLineWeight="polygonLineWeight"in a?a.polygonLineWeight:this.lineWeight;this.fillColor="fillColor"in a?a.fillColor:this.color;this.fillOpacity="fillOpacity"in a?a.fillOpacity:0.25;this.eventColor="eventColor"in a?a.eventColor:this.color;this.eventIcon="eventIcon"in a?a.eventIcon:"timemap/images/red-circle.png"}TimeMapDataset.redTheme=function(){return new TimeMapDatasetTheme({})};TimeMapDataset.blueTheme=function(){var a=new GIcon(G_DEFAULT_ICON);a.image="http://www.google.com/intl/en_us/mapfiles/ms/icons/blue-dot.png";a.iconSize=new GSize(32,32);a.shadow="http://www.google.com/intl/en_us/mapfiles/ms/icons/msmarker.shadow.png";a.shadowSize=new GSize(59,32);return new TimeMapDatasetTheme({icon:a,color:"#5A7ACF",eventIcon:"timemap/images/blue-circle.png"})};TimeMapDataset.greenTheme=function(){var a=new GIcon(G_DEFAULT_ICON);a.image="http://www.google.com/intl/en_us/mapfiles/ms/icons/green-dot.png";a.iconSize=new GSize(32,32);a.shadow="http://www.google.com/intl/en_us/mapfiles/ms/icons/msmarker.shadow.png";a.shadowSize=new GSize(59,32);return new TimeMapDatasetTheme({icon:a,color:"#19CF54",eventIcon:"timemap/images/green-circle.png"})};TimeMapDataset.ltblueTheme=function(){var a=new GIcon(G_DEFAULT_ICON);a.image="http://www.google.com/intl/en_us/mapfiles/ms/icons/ltblue-dot.png";a.iconSize=new GSize(32,32);a.shadow="http://www.google.com/intl/en_us/mapfiles/ms/icons/msmarker.shadow.png";a.shadowSize=new GSize(59,32);return new TimeMapDatasetTheme({icon:a,color:"#5ACFCF",eventIcon:"timemap/images/ltblue-circle.png"})};TimeMapDataset.purpleTheme=function(){var a=new GIcon(G_DEFAULT_ICON);a.image="http://www.google.com/intl/en_us/mapfiles/ms/icons/purple-dot.png";a.iconSize=new GSize(32,32);a.shadow="http://www.google.com/intl/en_us/mapfiles/ms/icons/msmarker.shadow.png";a.shadowSize=new GSize(59,32);return new TimeMapDatasetTheme({icon:a,color:"#8E67FD",eventIcon:"timemap/images/purple-circle.png"})};function TimeMapItem(a,b,c,d){this.placemark=a;this.event=b;this.map=c;this._type="type"in d?d.type:"";this._title="title"in d?d.title:"";this._description="description"in d?d.description:"";this._infoPoint="infoPoint"in d?d.infoPoint:null;this._infoHtml="infoHtml"in d?d.infoHtml:"";this._infoUrl="infoUrl"in d?d.infoUrl:"";this._maxInfoHtml="maxInfoHtml"in d?d.maxInfoHtml:"";this._maxInfoUrl="maxInfoUrl"in d?d.maxInfoUrl:"";this._maxOnly="maxInfoUrl"in d?d.maxOnly:false;this.getType=function(){return this._type};this.getTitle=function(){return this._title};this.getInfoPoint=function(){return this._infoPoint};if(this._infoHtml==""&&this._infoUrl==""&&!this._maxOnly){this._infoHtml='<div class="infotitle">'+this._title+"</div>";if(this._description!="")this._infoHtml+='<div class="infodescription">'+this._description+"</div>"}}TimeMapItem.prototype.openInfoWindow=function(){var a,b=false;if(this._maxInfoHtml!=""||this._maxInfoUrl!=""){b=true;var c=document.createElement("div");if(this._maxInfoHtml!="")c.innerHTML=this._maxInfoHtml;else c.innerHTML="Loading...";a={maxContent:c};if(this._maxInfoHtml==""){var d=this.map.getInfoWindow();var e=this._maxInfoUrl;GEvent.addListener(d,"maximizeclick",function(){GDownloadUrl(e,function(a){c.innerHTML=a})})}}else a={};if(this._infoHtml!=""||b&&this._maxOnly){if(this.getType()=="marker")this.placemark.openInfoWindowHtml(this._infoHtml,a);else this.map.openInfoWindowHtml(this.getInfoPoint(),this._infoHtml,a);if(b&&this._maxOnly){this.map.getInfoWindow().maximize();var d=this.map.getInfoWindow();var f=this.map;GEvent.addListener(d,"restoreclick",function(){f.closeInfoWindow()})}}else if(this._infoUrl!=""){var g=this;GDownloadUrl(this._infoUrl,function(a){g._infoHtml=a;g.openInfoWindow()})}};TimeMapItem.prototype.closeInfoWindow=function(){if(this.getType()=="marker")this.placemark.closeInfoWindow();else{var a=this.map.getInfoWindow();if(a.getPoint()==this.getInfoPoint()&&!a.isHidden())this.map.closeInfoWindow()}};function trim(a){return a.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}