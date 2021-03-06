/*!
 ColReorder 1.1.1
 ©2010-2014 SpryMedia Ltd - datatables.net/license
*/
(function(n, p, q) {
    function m(b) {
        for (var e = [], a = 0, f = b.length; a < f; a++) e[b[a]] = a;
        return e;
    }
    function i(b, e, a) {
        e = b.splice(e, 1)[0];
        b.splice(a, 0, e);
    }
    function o(b, e, a) {
        for (var f = [], c = 0, d = b.childNodes.length; c < d; c++) 1 == b.childNodes[c].nodeType && f.push(b.childNodes[c]);
        e = f[e];
        null !== a ? b.insertBefore(e, f[a]) : b.appendChild(e);
    }
    $.fn.dataTableExt.oApi.fnColReorder = function(b, e, a) {
        var f = $.fn.dataTable.Api ? !0 : !1, c, d, g, l, j = b.aoColumns.length, h;
        if (e != a) if (0 > e || e >= j) this.oApi._fnLog(b, 1, "ColReorder 'from' index is out of bounds: " + e); else if (0 > a || a >= j) this.oApi._fnLog(b, 1, "ColReorder 'to' index is out of bounds: " + a); else {
            g = [];
            c = 0;
            for (d = j; c < d; c++) g[c] = c;
            i(g, e, a);
            var k = m(g);
            c = 0;
            for (d = b.aaSorting.length; c < d; c++) b.aaSorting[c][0] = k[b.aaSorting[c][0]];
            if (null !== b.aaSortingFixed) {
                c = 0;
                for (d = b.aaSortingFixed.length; c < d; c++) b.aaSortingFixed[c][0] = k[b.aaSortingFixed[c][0]];
            }
            c = 0;
            for (d = j; c < d; c++) {
                h = b.aoColumns[c];
                g = 0;
                for (l = h.aDataSort.length; g < l; g++) h.aDataSort[g] = k[h.aDataSort[g]];
                f && (h.idx = k[h.idx]);
            }
            f && $.each(b.aLastSort, function(a, c) {
                b.aLastSort[a].src = k[c.src];
            });
            c = 0;
            for (d = j; c < d; c++) h = b.aoColumns[c], "number" == typeof h.mData && (h.mData = k[h.mData], 
            b.oApi._fnColumnOptions(b, c, {}));
            if (b.aoColumns[e].bVisible) {
                l = this.oApi._fnColumnIndexToVisible(b, e);
                h = null;
                for (c = a < e ? a : a + 1; null === h && c < j; ) h = this.oApi._fnColumnIndexToVisible(b, c), 
                c++;
                g = b.nTHead.getElementsByTagName("tr");
                c = 0;
                for (d = g.length; c < d; c++) o(g[c], l, h);
                if (null !== b.nTFoot) {
                    g = b.nTFoot.getElementsByTagName("tr");
                    c = 0;
                    for (d = g.length; c < d; c++) o(g[c], l, h);
                }
                c = 0;
                for (d = b.aoData.length; c < d; c++) null !== b.aoData[c].nTr && o(b.aoData[c].nTr, l, h);
            }
            i(b.aoColumns, e, a);
            i(b.aoPreSearchCols, e, a);
            c = 0;
            for (d = b.aoData.length; c < d; c++) g = b.aoData[c], f ? (g.anCells && i(g.anCells, e, a), 
            "dom" !== g.src && $.isArray(g._aData) && i(g._aData, e, a)) : ($.isArray(g._aData) && i(g._aData, e, a), 
            i(g._anHidden, e, a));
            c = 0;
            for (d = b.aoHeader.length; c < d; c++) i(b.aoHeader[c], e, a);
            if (null !== b.aoFooter) {
                c = 0;
                for (d = b.aoFooter.length; c < d; c++) i(b.aoFooter[c], e, a);
            }
            f && new $.fn.dataTable.Api(b).rows().invalidate();
            c = 0;
            for (d = j; c < d; c++) $(b.aoColumns[c].nTh).off("click.DT"), this.oApi._fnSortAttachListener(b, b.aoColumns[c].nTh, c);
            $(b.oInstance).trigger("column-reorder", [ b, {
                iFrom: e,
                iTo: a,
                aiInvertMapping: k
            } ]);
        }
    };
    n = function(b) {
        var e = function(a, f) {
            var c;
            b.fn.dataTable.Api ? c = new b.fn.dataTable.Api(a).settings()[0] : a.fnSettings ? c = a.fnSettings() : "string" === typeof a ? b.fn.dataTable.fnIsDataTable(b(a)[0]) && (c = b(a).eq(0).dataTable().fnSettings()) : a.nodeName && "table" === a.nodeName.toLowerCase() ? b.fn.dataTable.fnIsDataTable(a.nodeName) && (c = b(a.nodeName).dataTable().fnSettings()) : a instanceof jQuery ? b.fn.dataTable.fnIsDataTable(a[0]) && (c = a.eq(0).dataTable().fnSettings()) : c = a;
            b.fn.dataTable.camelToHungarian && b.fn.dataTable.camelToHungarian(e.defaults, f || {});
            this.s = {
                dt: null,
                init: b.extend(!0, {}, e.defaults, f),
                fixed: 0,
                fixedRight: 0,
                dropCallback: null,
                mouse: {
                    startX: -1,
                    startY: -1,
                    offsetX: -1,
                    offsetY: -1,
                    target: -1,
                    targetIndex: -1,
                    fromIndex: -1
                },
                aoTargets: []
            };
            this.dom = {
                drag: null,
                pointer: null
            };
            this.s.dt = c.oInstance.fnSettings();
            this.s.dt._colReorder = this;
            this._fnConstruct();
            c.oApi._fnCallbackReg(c, "aoDestroyCallback", b.proxy(this._fnDestroy, this), "ColReorder");
            return this;
        };
        e.prototype = {
            fnReset: function() {
                for (var a = [], b = 0, c = this.s.dt.aoColumns.length; b < c; b++) a.push(this.s.dt.aoColumns[b]._ColReorder_iOrigCol);
                this._fnOrderColumns(a);
                return this;
            },
            fnGetCurrentOrder: function() {
                return this.fnOrder();
            },
            fnOrder: function(a) {
                if (a === q) {
                    for (var a = [], b = 0, c = this.s.dt.aoColumns.length; b < c; b++) a.push(this.s.dt.aoColumns[b]._ColReorder_iOrigCol);
                    return a;
                }
                this._fnOrderColumns(m(a));
                return this;
            },
            _fnConstruct: function() {
                var a = this, b = this.s.dt.aoColumns.length, c;
                this.s.init.iFixedColumns && (this.s.fixed = this.s.init.iFixedColumns);
                this.s.fixedRight = this.s.init.iFixedColumnsRight ? this.s.init.iFixedColumnsRight : 0;
                this.s.init.fnReorderCallback && (this.s.dropCallback = this.s.init.fnReorderCallback);
                for (c = 0; c < b; c++) c > this.s.fixed - 1 && c < b - this.s.fixedRight && this._fnMouseListener(c, this.s.dt.aoColumns[c].nTh), 
                this.s.dt.aoColumns[c]._ColReorder_iOrigCol = c;
                this.s.dt.oApi._fnCallbackReg(this.s.dt, "aoStateSaveParams", function(c, b) {
                    a._fnStateSave.call(a, b);
                }, "ColReorder_State");
                var d = null;
                this.s.init.aiOrder && (d = this.s.init.aiOrder.slice());
                this.s.dt.oLoadedState && ("undefined" != typeof this.s.dt.oLoadedState.ColReorder && this.s.dt.oLoadedState.ColReorder.length == this.s.dt.aoColumns.length) && (d = this.s.dt.oLoadedState.ColReorder);
                if (d) if (a.s.dt._bInitComplete) b = m(d), a._fnOrderColumns.call(a, b); else {
                    var g = !1;
                    this.s.dt.aoDrawCallback.push({
                        fn: function() {
                            if (!a.s.dt._bInitComplete && !g) {
                                g = true;
                                var c = m(d);
                                a._fnOrderColumns.call(a, c);
                            }
                        },
                        sName: "ColReorder_Pre"
                    });
                } else this._fnSetColumnIndexes();
            },
            _fnOrderColumns: function(a) {
                if (a.length != this.s.dt.aoColumns.length) this.s.dt.oInstance.oApi._fnLog(this.s.dt, 1, "ColReorder - array reorder does not match known number of columns. Skipping."); else {
                    for (var f = 0, c = a.length; f < c; f++) {
                        var d = b.inArray(f, a);
                        f != d && (i(a, d, f), this.s.dt.oInstance.fnColReorder(d, f));
                    }
                    ("" !== this.s.dt.oScroll.sX || "" !== this.s.dt.oScroll.sY) && this.s.dt.oInstance.fnAdjustColumnSizing();
                    this.s.dt.oInstance.oApi._fnSaveState(this.s.dt);
                    this._fnSetColumnIndexes();
                }
            },
            _fnStateSave: function(a) {
                var f, c, d, g = this.s.dt;
                for (f = 0; f < a.aaSorting.length; f++) a.aaSorting[f][0] = g.aoColumns[a.aaSorting[f][0]]._ColReorder_iOrigCol;
                var e = b.extend(!0, [], a.aoSearchCols);
                a.ColReorder = [];
                f = 0;
                for (c = g.aoColumns.length; f < c; f++) d = g.aoColumns[f]._ColReorder_iOrigCol, 
                a.aoSearchCols[d] = e[f], a.abVisCols[d] = g.aoColumns[f].bVisible, a.ColReorder.push(d);
            },
            _fnMouseListener: function(a, f) {
                var c = this;
                b(f).on("mousedown.ColReorder", function(a) {
                    a.preventDefault();
                    c._fnMouseDown.call(c, a, f);
                });
            },
            _fnMouseDown: function(a, f) {
                var c = this, d = b(a.target).closest("th, td").offset(), e = parseInt(b(f).attr("data-column-index"), 10);
                e !== q && (this.s.mouse.startX = a.pageX, this.s.mouse.startY = a.pageY, this.s.mouse.offsetX = a.pageX - d.left, 
                this.s.mouse.offsetY = a.pageY - d.top, this.s.mouse.target = this.s.dt.aoColumns[e].nTh, 
                this.s.mouse.targetIndex = e, this.s.mouse.fromIndex = e, this._fnRegions(), b(p).on("mousemove.ColReorder", function(a) {
                    c._fnMouseMove.call(c, a);
                }).on("mouseup.ColReorder", function(a) {
                    c._fnMouseUp.call(c, a);
                }));
            },
            _fnMouseMove: function(a) {
                if (null === this.dom.drag) {
                    if (5 > Math.pow(Math.pow(a.pageX - this.s.mouse.startX, 2) + Math.pow(a.pageY - this.s.mouse.startY, 2), .5)) return;
                    this._fnCreateDragNode();
                }
                this.dom.drag.css({
                    left: a.pageX - this.s.mouse.offsetX,
                    top: a.pageY - this.s.mouse.offsetY
                });
                for (var b = !1, c = this.s.mouse.toIndex, d = 1, e = this.s.aoTargets.length; d < e; d++) if (a.pageX < this.s.aoTargets[d - 1].x + (this.s.aoTargets[d].x - this.s.aoTargets[d - 1].x) / 2) {
                    this.dom.pointer.css("left", this.s.aoTargets[d - 1].x);
                    this.s.mouse.toIndex = this.s.aoTargets[d - 1].to;
                    b = !0;
                    break;
                }
                b || (this.dom.pointer.css("left", this.s.aoTargets[this.s.aoTargets.length - 1].x), 
                this.s.mouse.toIndex = this.s.aoTargets[this.s.aoTargets.length - 1].to);
                this.s.init.bRealtime && c !== this.s.mouse.toIndex && (this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex, this.s.mouse.toIndex), 
                this.s.mouse.fromIndex = this.s.mouse.toIndex, this._fnRegions());
            },
            _fnMouseUp: function() {
                b(p).off("mousemove.ColReorder mouseup.ColReorder");
                null !== this.dom.drag && (this.dom.drag.remove(), this.dom.pointer.remove(), this.dom.drag = null, 
                this.dom.pointer = null, this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex, this.s.mouse.toIndex), 
                this._fnSetColumnIndexes(), ("" !== this.s.dt.oScroll.sX || "" !== this.s.dt.oScroll.sY) && this.s.dt.oInstance.fnAdjustColumnSizing(), 
                null !== this.s.dropCallback && this.s.dropCallback.call(this), this.s.dt.oInstance.oApi._fnSaveState(this.s.dt));
            },
            _fnRegions: function() {
                var a = this.s.dt.aoColumns;
                this.s.aoTargets.splice(0, this.s.aoTargets.length);
                this.s.aoTargets.push({
                    x: b(this.s.dt.nTable).offset().left,
                    to: 0
                });
                for (var f = 0, c = 0, d = a.length; c < d; c++) c != this.s.mouse.fromIndex && f++, 
                a[c].bVisible && this.s.aoTargets.push({
                    x: b(a[c].nTh).offset().left + b(a[c].nTh).outerWidth(),
                    to: f
                });
                0 !== this.s.fixedRight && this.s.aoTargets.splice(this.s.aoTargets.length - this.s.fixedRight);
                0 !== this.s.fixed && this.s.aoTargets.splice(0, this.s.fixed);
            },
            _fnCreateDragNode: function() {
                var a = "" !== this.s.dt.oScroll.sX || "" !== this.s.dt.oScroll.sY, f = this.s.dt.aoColumns[this.s.mouse.targetIndex].nTh, c = f.parentNode, d = c.parentNode, e = d.parentNode, i = b(f).clone();
                this.dom.drag = b(e.cloneNode(!1)).addClass("DTCR_clonedTable").append(d.cloneNode(!1).appendChild(c.cloneNode(!1).appendChild(i[0]))).css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: b(f).outerWidth(),
                    height: b(f).outerHeight()
                }).appendTo("body");
                this.dom.pointer = b("<div></div>").addClass("DTCR_pointer").css({
                    position: "absolute",
                    top: a ? b("div.dataTables_scroll", this.s.dt.nTableWrapper).offset().top : b(this.s.dt.nTable).offset().top,
                    height: a ? b("div.dataTables_scroll", this.s.dt.nTableWrapper).height() : b(this.s.dt.nTable).height()
                }).appendTo("body");
            },
            _fnDestroy: function() {
                var a, f;
                a = 0;
                for (f = this.s.dt.aoDrawCallback.length; a < f; a++) if ("ColReorder_Pre" === this.s.dt.aoDrawCallback[a].sName) {
                    this.s.dt.aoDrawCallback.splice(a, 1);
                    break;
                }
                b(this.s.dt.nTHead).find("*").off(".ColReorder");
                b.each(this.s.dt.aoColumns, function(a, d) {
                    b(d.nTh).removeAttr("data-column-index");
                });
                this.s = this.s.dt._colReorder = null;
            },
            _fnSetColumnIndexes: function() {
                b.each(this.s.dt.aoColumns, function(a, f) {
                    b(f.nTh).attr("data-column-index", a);
                });
            }
        };
        e.defaults = {
            aiOrder: null,
            bRealtime: !1,
            iFixedColumns: 0,
            iFixedColumnsRight: 0,
            fnReorderCallback: null
        };
        e.version = "1.1.1";
        b.fn.dataTable.ColReorder = e;
        b.fn.DataTable.ColReorder = e;
        "function" == typeof b.fn.dataTable && "function" == typeof b.fn.dataTableExt.fnVersionCheck && b.fn.dataTableExt.fnVersionCheck("1.9.3") ? b.fn.dataTableExt.aoFeatures.push({
            fnInit: function(a) {
                var b = a.oInstance;
                a._colReorder ? b.oApi._fnLog(a, 1, "ColReorder attempted to initialise twice. Ignoring second") : (b = a.oInit, 
                new e(a, b.colReorder || b.oColReorder || {}));
                return null;
            },
            cFeature: "R",
            sFeature: "ColReorder"
        }) : alert("Warning: ColReorder requires DataTables 1.9.3 or greater - www.datatables.net/download");
        b.fn.dataTable.Api && (b.fn.dataTable.Api.register("colReorder.reset()", function() {
            return this.iterator("table", function(a) {
                a._colReorder.fnReset();
            });
        }), b.fn.dataTable.Api.register("colReorder.order()", function(a) {
            return a ? this.iterator("table", function(b) {
                b._colReorder.fnOrder(a);
            }) : this.context.length ? this.context[0]._colReorder.fnOrder() : null;
        }));
        return e;
    };
    "function" === typeof define && define.amd ? define("datatables-colreorder", [ "jquery", "datatables" ], n) : jQuery && !jQuery.fn.dataTable.ColReorder && n(jQuery, jQuery.fn.dataTable);
})(window, document);