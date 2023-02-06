/*!
 * Skyline js 1.10.0
 * @license MIT licensed *
 * Copyright (C) 2021 PNThai
 */

(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.Skyline = factory();
    }
})(this, function (global) {
    var Skyline = function (options) {
        return new Skyline.lib.init(options)
    },
        version = '1.0.1'

    Skyline.lib = Skyline.prototype = {
        skyline: version,
        constructor: Skyline,
        init: function (source, options) {
            if (!options) {
                options = {}
            }
            if (!source) {
                source = []
            }
            this.source = source
            this.skylineElement = null
            this.rootElement = document.getElementById('skyline-container')

            this.options = Object.assign({
                fit: true,
                maxWidth: "100%",
                maxHeight: "100%",
                callback: function () { },

                offset: {
                    x: 0,
                    y: 0
                },
                title: "SKYLINE CHART",
                titlePosition: "top center"
            }, options);

            this.skylineElement = null;
            this.from = _getMinDate(this.source);
            this.to = _getMaxDate(this.source);
            // this.duration = _getDuration(from, to);

            this.firstFriday = _findFriday(this.from);
            this.lastFriday = _findFriday(this.to)
            this.weeksCount = _getWeeksCount(this.firstFriday, this.lastFriday);
            // console.log('from ', moment(this.from).format("DD/MM/YYYY"))
            // console.log('to ', moment(this.to).format("DD/MM/YYYY"))

            // console.log('firstFriday ', moment(this.firstFriday).format("DD/MM/YYYY"));
            // console.log('lastFriday', moment(this.lastFriday).format("DD/MM/YYYY"));

            this.cellOptions = {
                width: "100px",
                height: "50px",
                color: "#fff",
                offset: {
                    x: 0,
                    y: 0
                }
            }
            return this
        },
        _fillCells(chartContainer) {
            for (let i = 0; i < this.listCells.length; i++) {
                let listCellsPerWeek = this.listCells[i];
                let weekDiv = document.createElement("div");
                weekDiv.className = "week week-" + i;

                if (listCellsPerWeek.length > 0) {
                    for (let j = 0; j < listCellsPerWeek.length; j++) {
                        weekDiv.insertBefore(listCellsPerWeek[j].draw(), weekDiv.lastChild)
                    }
                }
                let weekMonday = document.createElement("div");
                weekMonday.className = "week-day";
                weekMonday.innerText = moment(this.listWeeks[i].toString()).format("DD/MM/YY");
                weekDiv.insertBefore(weekMonday, weekDiv.firstChild);

                chartContainer.insertBefore(weekDiv, chartContainer.lastChild);
            }
        },
        _buildSkyline: function () {
            // Validating if the options are defined
            if (!this.options) {
                throw "Skyline is not initialized";
            }
            if (!this.rootElement) {
                throw "Root element is not defined";
            }
            // let titleElement = document.createElement("div");
            // titleElement.className = 'skyline-title';
            // titleElement.innerText = options.title;
            // this.rootElement.insertBefore(titleElement, rootElement.firstChild);

            let chartElement = document.createElement("div");
            chartElement.className = 'skyline-chart';
            this.listWeeks = this._getWeeks(this.source);
            this.listCells = this._arrangeToWeeks(this.source, this.cellOptions)
            // console.log(source)
            // console.log(listCells)
            this._fillCells(chartElement);

            this.rootElement.insertBefore(chartElement, this.rootElement.lastChild);

            return this.rootElement;
        },
        _arrangeToWeeks(_source, cellOptions) {
            let _listCells = [];
            for (let i = 0; i < this.weeksCount; i++) {
                _listCells.push([]);
            }

            for (let i = 0; i < _source.length; i++) {
                let cellData = _source[i];
                let cell = new SkylineCell(cellData, cellOptions);
                let cellDate = (Date.parse(cell.data.Date));

                let weekNo = Math.floor((cellDate - this.firstFriday) / (7 * 24 * 3600 * 1000));

                if (cellDate) {
                    _listCells[weekNo].push(cell);
                }

            }

            return _listCells;
        },
        _getWeeks() {
            let weeks = [];
            for (let i = 0; i < this.weeksCount; i++) {
                let _thisWeek = this.firstFriday + (7 * 24 * 3600 * 1000) * i
                weeks.push(new Date(_thisWeek));
            }
            // console.log(weeks);
            return weeks;
        },
        _getMostCrowdedWeek() {
            let max = 0;
            for (let i = 0; i < this.weeksCount; i++) {
                if (this.listWeeks[i].length > max) {
                    max = this.listWeeks[i].length;
                }
            }
            return max;
        },
        _destroySkyline() {
            this.rootElement.innerHTML = "";
        },
        destroy() {
            skylineElement = this._destroySkyline();
        },
        show: function () {
            skylineElement = this._buildSkyline();

        }
    }

    function _getMinDate(_source) {
        let min = _source.map(x => (x.Date != null && x.Date != '') ? Date.parse(x.Date) : null)
            .reduce((min, x) => (x < min && x != null) ? x : min, 8640000000000000)
        // console.log(`min: ${new Date(min)}`)

        return min;
    }
    function _getMaxDate(_source) {
        let max = _source.map(x => (x.Date != null && x.Date != '') ? Date.parse(x.Date) : null)
            .reduce((max, x) => (x > max && x != null) ? x : max, -8640000000000000)
        // console.log(`max: ${new Date(max)}`)
        return max;
    }
    function _findMonday(refDate) {
        let weekDay = (new Date(refDate)).getDay();
        if (weekDay == 0) {
            return (refDate - 7)
        } else {
            // console.log(`first Monday: ${new Date(refDate - (weekDay - 1)*(24*3600*1000))}`);
            return (refDate - weekDay + 1)
        }
    }
    function _findFriday(refDate) {
        let weekDay = (new Date(refDate)).getDay();
        if (weekDay == 0) {
            return (refDate + 5)
        } else {
            return (refDate - weekDay + 5)
        }
    }
    function _getDuration(fromDate, toDate) {
        let duration = (toDate - fromDate) / (24 * 3600 * 1000);
        // console.log(duration)
        return duration;
    }
    function _getWeeksCount(fromDate, toDate) {
        let duration = (toDate - fromDate) / (24 * 3600 * 1000);
        let weeks = Math.ceil(duration / 7);
        // console.log(weeks);
        return weeks;
    }



    class SkylineCell {

        constructor(cellData, options) {
            this.version - "1.0.0";
            this.data = cellData;
            this.options = {};
            this.cellElement = null;
            this.rootElement = document.getElementsByClassName('skyline-chart');

            this._getCellData();

            this._init(options);
        }



        _getCellData() {
            this.SubSystem = this.data.SubSystem
            this.Index = this.data.Index
        }
        /**
         * Build the Skyline element
         * @return {Element}
         * @private
         */
        _buildCell() {
            // Validating if the options are defined
            if (!this.options) {
                throw "Skyline cell is not initialized";
            }
            if (!this.data) {
                throw "Source data is not available"
            }
            let skylineElement = document.createElement("div");
            skylineElement.className = 'cell sm';

            skylineElement.setAttribute("status", this.data.Status)
            skylineElement.setAttribute("index", this.data.Index)
            // skylineElement.setAttribute()

            let title = document.createElement("div");
            title.className = "title";
            title.innerText = this.data.SubSystem;
            skylineElement.insertBefore(title, skylineElement.lastChild);


            let status = document.createElement("div");
            status.className = "status";
            skylineElement.insertBefore(status, skylineElement.lastChild);
            let completed = document.createElement("div");
            completed.className = "completed";
            skylineElement.insertBefore(completed, skylineElement.lastChild);


            // Triggering the click event of cell 
            skylineElement.addEventListener(
                "click",
                (event) => {
                    console.log(this)
                    var cellInfo = document.getElementsByClassName("cell-info");
                    $(cellInfo).removeClass('hidden')
                }
            );

            // console.log(skylineElement)
            return skylineElement;
        }

        _init(options) {
            this.options = Object.assign({
                width: "100px",
                height: "40px",
                callback: function () { },
                color: "#fff",
                offset: {
                    x: 0,
                    y: 0
                }
            }, options);

        }

        draw() {
            //Creating DOM object
            return this._buildCell();

        }

    }

    Skyline.lib.init.prototype = Skyline.lib

    return Skyline
})