/*!
 Scroller 1.2.1
 2011-2014 SpryMedia Ltd - datatables.net/license
*/
(function(j, m, k) {
    var l = function(e) {
        var f = function(a, b) {
            !this instanceof f ? alert("Scroller warning: Scroller must be initialised with the 'new' keyword.") : ("undefined" == typeof b && (b = {}), 
            this.s = {
                dt: a,
                tableTop: 0,
                tableBottom: 0,
                redrawTop: 0,
                redrawBottom: 0,
                autoHeight: !0,
                viewportRows: 0,
                stateTO: null,
                drawTO: null,
                heights: {
                    jump: null,
                    page: null,
                    virtual: null,
                    scroll: null,
                    row: null,
                    viewport: null
                },
                topRowFloat: 0,
                scrollDrawDiff: null
            }, this.s = e.extend(this.s, f.oDefaults, b), this.s.heights.row = this.s.rowHeight, 
            this.dom = {
                force: m.createElement("div"),
                scroller: null,
                table: null
            }, this.s.dt.oScroller = this, this._fnConstruct());
        };
        f.prototype = {
            fnRowToPixels: function(a, b, c) {
                a = c ? this._domain("virtualToPhysical", a * this.s.heights.row) : this.s.baseScrollTop + (a - this.s.baseRowTop) * this.s.heights.row;
                return b || b === k ? parseInt(a, 10) : a;
            },
            fnPixelsToRow: function(a, b, c) {
                var d = a - this.s.baseScrollTop, a = c ? this._domain("physicalToVirtual", a) / this.s.heights.row : d / this.s.heights.row + this.s.baseRowTop;
                return b || b === k ? parseInt(a, 10) : a;
            },
            fnScrollToRow: function(a, b) {
                var c = this, d = !1, g = this.fnRowToPixels(a), f = a - (this.s.displayBuffer - 1) / 2 * this.s.viewportRows;
                0 > f && (f = 0);
                if ((g > this.s.redrawBottom || g < this.s.redrawTop) && this.s.dt._iDisplayStart !== f) d = !0, 
                g = this.fnRowToPixels(a, !1, !0);
                "undefined" == typeof b || b ? (this.s.ani = d, e(this.dom.scroller).animate({
                    scrollTop: g
                }, function() {
                    setTimeout(function() {
                        c.s.ani = !1;
                    }, 0);
                })) : e(this.dom.scroller).scrollTop(g);
            },
            fnMeasure: function(a) {
                this.s.autoHeight && this._fnCalcRowHeight();
                var b = this.s.heights;
                b.viewport = e(this.dom.scroller).height();
                this.s.viewportRows = parseInt(b.viewport / b.row, 10) + 1;
                this.s.dt._iDisplayLength = this.s.viewportRows * this.s.displayBuffer;
                ("undefined" == typeof a || a) && this.s.dt.oInstance.fnDraw();
            },
            _fnConstruct: function() {
                var a = this;
                if (this.s.dt.oFeatures.bPaginate) {
                    this.dom.force.style.position = "absolute";
                    this.dom.force.style.top = "0px";
                    this.dom.force.style.left = "0px";
                    this.dom.force.style.width = "1px";
                    this.dom.scroller = e("div." + this.s.dt.oClasses.sScrollBody, this.s.dt.nTableWrapper)[0];
                    this.dom.scroller.appendChild(this.dom.force);
                    this.dom.scroller.style.position = "relative";
                    this.dom.table = e(">table", this.dom.scroller)[0];
                    this.dom.table.style.position = "absolute";
                    this.dom.table.style.top = "0px";
                    this.dom.table.style.left = "0px";
                    e(this.s.dt.nTableWrapper).addClass("DTS");
                    this.s.loadingIndicator && e(this.dom.scroller.parentNode).css("position", "relative").append('<div class="DTS_Loading">' + this.s.dt.oLanguage.sLoadingRecords + "</div>");
                    this.s.heights.row && "auto" != this.s.heights.row && (this.s.autoHeight = !1);
                    this.fnMeasure(!1);
                    e(this.dom.scroller).on("scroll.DTS", function() {
                        a._fnScroll.call(a);
                    });
                    e(this.dom.scroller).on("touchstart.DTS", function() {
                        a._fnScroll.call(a);
                    });
                    this.s.dt.aoDrawCallback.push({
                        fn: function() {
                            a.s.dt.bInitialised && a._fnDrawCallback.call(a);
                        },
                        sName: "Scroller"
                    });
                    e(j).on("resize.DTS", function() {
                        a._fnInfo();
                    });
                    var b = !0;
                    this.s.dt.oApi._fnCallbackReg(this.s.dt, "aoStateSaveParams", function(c, d) {
                        if (b && a.s.dt.oLoadedState) {
                            d.iScroller = a.s.dt.oLoadedState.iScroller;
                            b = false;
                        } else d.iScroller = a.dom.scroller.scrollTop;
                    }, "Scroller_State");
                    this.s.dt.aoDestroyCallback.push({
                        sName: "Scroller",
                        fn: function() {
                            e(j).off("resize.DTS");
                            e(a.dom.scroller).off("touchstart.DTS scroll.DTS");
                            e(a.s.dt.nTableWrapper).removeClass("DTS");
                            e("div.DTS_Loading", a.dom.scroller.parentNode).remove();
                            a.dom.table.style.position = "";
                            a.dom.table.style.top = "";
                            a.dom.table.style.left = "";
                        }
                    });
                } else this.s.dt.oApi._fnLog(this.s.dt, 0, "Pagination must be enabled for Scroller");
            },
            _fnScroll: function() {
                var a = this, b = this.s.heights, c = this.dom.scroller.scrollTop, d;
                if (!this.s.skip) if (this.s.dt.bFiltered || this.s.dt.bSorted) this.s.lastScrollTop = 0; else {
                    this._fnInfo();
                    clearTimeout(this.s.stateTO);
                    this.s.stateTO = setTimeout(function() {
                        a.s.dt.oApi._fnSaveState(a.s.dt);
                    }, 250);
                    if (c < this.s.redrawTop || c > this.s.redrawBottom) {
                        var g = Math.ceil((this.s.displayBuffer - 1) / 2 * this.s.viewportRows);
                        Math.abs(c - this.s.lastScrollTop) > b.viewport || this.s.ani ? (d = parseInt(this._domain("physicalToVirtual", c) / b.row, 10) - g, 
                        this.s.topRowFloat = this._domain("physicalToVirtual", c) / b.row) : (d = this.fnPixelsToRow(c) - g, 
                        this.s.topRowFloat = this.fnPixelsToRow(c, !1));
                        0 >= d ? d = 0 : d + this.s.dt._iDisplayLength > this.s.dt.fnRecordsDisplay() ? (d = this.s.dt.fnRecordsDisplay() - this.s.dt._iDisplayLength, 
                        0 > d && (d = 0)) : 0 !== d % 2 && d++;
                        d != this.s.dt._iDisplayStart && (this.s.tableTop = e(this.s.dt.nTable).offset().top, 
                        this.s.tableBottom = e(this.s.dt.nTable).height() + this.s.tableTop, b = function() {
                            if (a.s.scrollDrawReq === null) a.s.scrollDrawReq = c;
                            a.s.dt._iDisplayStart = d;
                            a.s.dt.oApi._fnCalculateEnd && a.s.dt.oApi._fnCalculateEnd(a.s.dt);
                            a.s.dt.oApi._fnDraw(a.s.dt);
                        }, this.s.dt.oFeatures.bServerSide ? (clearTimeout(this.s.drawTO), this.s.drawTO = setTimeout(b, this.s.serverWait)) : b());
                    }
                    this.s.lastScrollTop = c;
                }
            },
            _domain: function(a, b) {
                var c = this.s.heights, d;
                if (c.virtual === c.scroll) {
                    d = (c.virtual - c.viewport) / (c.scroll - c.viewport);
                    if ("virtualToPhysical" === a) return b / d;
                    if ("physicalToVirtual" === a) return b * d;
                }
                var e = (c.scroll - c.viewport) / 2, f = (c.virtual - c.viewport) / 2;
                d = f / (e * e);
                if ("virtualToPhysical" === a) {
                    if (b < f) return Math.pow(b / d, .5);
                    b = 2 * f - b;
                    return 0 > b ? c.scroll : 2 * e - Math.pow(b / d, .5);
                }
                if ("physicalToVirtual" === a) {
                    if (b < e) return b * b * d;
                    b = 2 * e - b;
                    return 0 > b ? c.virtual : 2 * f - b * b * d;
                }
            },
            _fnDrawCallback: function() {
                var a = this, b = this.s.heights, c = this.dom.scroller.scrollTop, d = e(this.s.dt.nTable).height(), g = this.s.dt._iDisplayStart, f = this.s.dt._iDisplayLength, h = this.s.dt.fnRecordsDisplay();
                this.s.skip = !0;
                this._fnScrollForce();
                c = 0 === g ? this.s.topRowFloat * b.row : g + f >= h ? b.scroll - (h - this.s.topRowFloat) * b.row : this._domain("virtualToPhysical", this.s.topRowFloat * b.row);
                this.dom.scroller.scrollTop = c;
                this.s.baseScrollTop = c;
                this.s.baseRowTop = this.s.topRowFloat;
                var i = c - (this.s.topRowFloat - g) * b.row;
                0 === g ? i = 0 : g + f >= h && (i = b.scroll - d);
                this.dom.table.style.top = i + "px";
                this.s.tableTop = i;
                this.s.tableBottom = d + this.s.tableTop;
                d = (c - this.s.tableTop) * this.s.boundaryScale;
                this.s.redrawTop = c - d;
                this.s.redrawBottom = c + d;
                this.s.skip = !1;
                setTimeout(function() {
                    a._fnInfo.call(a);
                }, 0);
                this.s.dt.oFeatures.bStateSave && null !== this.s.dt.oLoadedState && "undefined" != typeof this.s.dt.oLoadedState.iScroller && ((c = this.s.dt.sAjaxSource || a.s.dt.ajax ? !0 : !1) && 2 == this.s.dt.iDraw || !c && 1 == this.s.dt.iDraw) && setTimeout(function() {
                    e(a.dom.scroller).scrollTop(a.s.dt.oLoadedState.iScroller);
                    a.s.redrawTop = a.s.dt.oLoadedState.iScroller - b.viewport / 2;
                }, 0);
            },
            _fnScrollForce: function() {
                var a = this.s.heights;
                a.virtual = a.row * this.s.dt.fnRecordsDisplay();
                a.scroll = a.virtual;
                1e6 < a.scroll && (a.scroll = 1e6);
                this.dom.force.style.height = a.scroll + "px";
            },
            _fnCalcRowHeight: function() {
                var a = this.s.dt.nTable, b = a.cloneNode(!1), c = e("<tbody/>").appendTo(b), d = e('<div class="' + this.s.dt.oClasses.sWrapper + ' DTS"><div class="' + this.s.dt.oClasses.sScrollWrapper + '"><div class="' + this.s.dt.oClasses.sScrollBody + '"></div></div></div>');
                for (e("tbody tr:lt(4)", a).clone().appendTo(c); 3 > e("tr", c).length; ) c.append("<tr><td>&nbsp;</td></tr>");
                e("div." + this.s.dt.oClasses.sScrollBody, d).append(b);
                d.appendTo(this.s.dt.nHolding);
                this.s.heights.row = e("tr", c).eq(1).outerHeight();
                d.remove();
            },
            _fnInfo: function() {
                if (this.s.dt.oFeatures.bInfo) {
                    var a = this.s.dt, b = this.dom.scroller.scrollTop, c = Math.floor(this.fnPixelsToRow(b, !1, this.s.ani) + 1), d = a.fnRecordsTotal(), f = a.fnRecordsDisplay(), b = Math.ceil(this.fnPixelsToRow(b + this.s.heights.viewport, !1, this.s.ani)), b = f < b ? f : b, c = a.fnFormatNumber(c), b = a.fnFormatNumber(b), d = a.fnFormatNumber(d), f = a.fnFormatNumber(f), f = 0 === a.fnRecordsDisplay() && a.fnRecordsDisplay() == a.fnRecordsTotal() ? a.oLanguage.sInfoEmpty + a.oLanguage.sInfoPostFix : 0 === a.fnRecordsDisplay() ? a.oLanguage.sInfoEmpty + " " + a.oLanguage.sInfoFiltered.replace("_MAX_", d) + a.oLanguage.sInfoPostFix : a.fnRecordsDisplay() == a.fnRecordsTotal() ? a.oLanguage.sInfo.replace("_START_", c).replace("_END_", b).replace("_TOTAL_", f) + a.oLanguage.sInfoPostFix : a.oLanguage.sInfo.replace("_START_", c).replace("_END_", b).replace("_TOTAL_", f) + " " + a.oLanguage.sInfoFiltered.replace("_MAX_", a.fnFormatNumber(a.fnRecordsTotal())) + a.oLanguage.sInfoPostFix, a = a.aanFeatures.i;
                    if ("undefined" != typeof a) {
                        d = 0;
                        for (c = a.length; d < c; d++) e(a[d]).html(f);
                    }
                }
            }
        };
        f.defaults = {
            trace: !1,
            rowHeight: "auto",
            serverWait: 200,
            displayBuffer: 9,
            boundaryScale: .5,
            loadingIndicator: !1
        };
        f.oDefaults = f.defaults;
        f.version = "1.2.1";
        "function" == typeof e.fn.dataTable && "function" == typeof e.fn.dataTableExt.fnVersionCheck && e.fn.dataTableExt.fnVersionCheck("1.9.0") ? e.fn.dataTableExt.aoFeatures.push({
            fnInit: function(a) {
                var b = a.oInit;
                return new f(a, b.scroller || b.oScroller || {}).dom.wrapper;
            },
            cFeature: "S",
            sFeature: "Scroller"
        }) : alert("Warning: Scroller requires DataTables 1.9.0 or greater - www.datatables.net/download");
        e.fn.dataTable.Scroller = f;
        e.fn.DataTable.Scroller = f;
        if (e.fn.dataTable.Api) {
            var h = e.fn.dataTable.Api;
            h.register("scroller().rowToPixels()", function(a, b, c) {
                var d = this.context;
                if (d.length && d[0].oScroller) return d[0].oScroller.fnRowToPixels(a, b, c);
            });
            h.register("scroller().pixelsToRow()", function(a, b, c) {
                var d = this.context;
                if (d.length && d[0].oScroller) return d[0].oScroller.fnPixelsToRow(a, b, c);
            });
            h.register("scroller().scrollToRow()", function(a, b) {
                this.iterator("table", function(c) {
                    c.oScroller && c.oScroller.fnScrollToRow(a, b);
                });
                return this;
            });
            h.register("scroller().measure()", function(a) {
                this.iterator("table", function(b) {
                    b.oScroller && b.oScroller.fnMeasure(a);
                });
                return this;
            });
        }
        return f;
    };
    "function" === typeof define && define.amd ? define("datatables-scroller", [ "jquery", "datatables" ], l) : jQuery && !jQuery.fn.dataTable.Scroller && l(jQuery, jQuery.fn.dataTable);
})(window, document);