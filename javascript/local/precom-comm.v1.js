const navigation = [
    {
        page: 'summary',
        location: './pages/summary.html',
        // preload: () => preloadSummary()
    }, {
        page: 'subsystem',
        location: './pages/subsystem.html',
        // preload: () => preloadData()
    }, {
        page: 'skyline',
        location: './pages/skyline.html',
        // preload: () => preloadData()
    }, {
        page: 'scurvecs',
        location: './pages/scurvecs.html',
        // preload: () => preloadData()
    }, {
        page: 'scurvedossier',
        location: './pages/scurvedossier.html',
        // preload: () => preloadData()
    }, {
        page: 'settings',
        location: './pages/settings.html'
    }, {
        page: 'error404',
        location: './pages/error404.html'
    }, {
        page: 'error401',
        location: './pages/unauthorized.html'
    }, {
        page: 'errorBackend',
        location: './pages/failedbackend.html'
    }
]

const deployId = 'AKfycbxxrLHgEv-TaUir4h2zYLyfbxMewaMem6Y-XXAiUkJnI_TkARQRK-epWShIPAYoB7lS'
const deployAdress = `https://script.google.com/macros/s/${deployId}/exec?`
const API = [
    // {
    //     host: 'sheetlabs',
    //     data: {
    //         skylineData: 'https://app.sheetlabs.com/RWIN/SkylineData',
    //         // checksheetSummary: 'https://app.sheetlabs.com/RWIN/ChecksheetSummary'
    //     }
    // },
    {
        host: 'GoogleSheetAPI',
        data: {
            settings: deployAdress + 'action=getSettings',
            summary: deployAdress + 'action=getSummary',
            skylineData: deployAdress + 'action=getSkyline',
            skylineDataV2: deployAdress + 'action=getSkylineV2',
            skylineDataV3: deployAdress + 'action=getSkylineV3',
            checksheetSummary: deployAdress + 'action=getCheckSheetSummary',
            rawData: deployAdress + 'action=getRawData',
            rawPunchList: deployAdress + 'action=getRawPunchList',
        }
    }

]

function removeLoader() {
    $('#page-loader').addClass('hidden')
}

function invokeLoader() {
    $('#page-loader').removeClass('hidden')
}

function reloadPage() {
    navigate(selectTab)
    showSnackbar("normal", `Last updated data: ${localStorage.getItem('lastUpdate')}`);
    // await window.location.reload()
}

async function fetchSkylineData(phase = null, facility = null, discipline = null) {
    invokeLoader()

    let fetchAPI = API.filter(x => x.host == service)[0].data.skylineData
    let paramQuery = ''
    paramQuery = phase ? `Phase=${phase}&` : ''
    paramQuery += facility ? `Facility=${facility}&` : ''
    paramQuery += discipline ? `Discipline=${discipline}&` : ''

    if (paramQuery.slice(-1) == '&') { paramQuery = paramQuery.slice(0, -1) }

    fetchAPI = fetchAPI + '&' + paramQuery
    // console.log(fetchAPI)

    await fetch(fetchAPI)
        .then(res => res.json())
        .then(data => {
            skylineData = data.data
            localStorage.setItem('skylineData', JSON.stringify({
                data: skylineData,
                expiry: moment(new Date()).add(settings.RefreshRate, 'seconds')
            }))
            // isDataPresence = true
            localStorage.setItem('lastUpdate', moment(Date.now()).format('DD/MM/YYYY hh:mm:ss'))
            // console.log('fetched : ', skylineData)
            removeLoader()

        })
}

function checkExpiry() {

}

async function fetchSummary() {
    invokeLoader()
    const fetchAPI = API.filter(x => x.host == service)[0].data.summary
    await fetch(fetchAPI)
        .then(res => res.json())
        .then(data => {
            summaryData = data.data
            localStorage.setItem('summaryData', JSON.stringify({
                data: summaryData,
                expiry: moment(new Date()).add(settings.RefreshRate, 'seconds')
            }))
            // console.log('fetched summary : ', summaryData)
            localStorage.setItem('lastUpdateSummary', moment(Date.now()).format('DD/MM/YYYY hh:mm:ss'))
            removeLoader()

        })
}

async function fetchSettings() {
    invokeLoader()
    const fetchAPI = API.filter(x => x.host == service)[0].data.settings
    await fetch(fetchAPI)
        .then(res => res.json())
        .then(data => {

            console.log('settings::', settings);
            settings = {
                ...settings,
                ...data.data[0]
            }
            console.log(settings);
            localStorage.setItem('settings', JSON.stringify({
                data: settings,
                expiry: moment(new Date()).add(settings.RefreshSettings, 'seconds')
            }))
            // console.log('fetched settings : ', settings)
            removeLoader()
        })
}

function preloadPage(tab) {
    if (errorCount >= 3) {
        navigate('errorBackend')
    } else {
        navigate(tab)
    }
    isSidebarShow = localStorage.getItem('showSidebar') ? parseInt(localStorage.getItem('showSidebar')) : 0
    if (isSidebarShow == 0) {
        $('#main-sidebar').addClass('hidden')
    } else {
        $('#main-sidebar').removeClass('hidden')

    }
}

function navigate(tab) {
    // preloadData()
    $(`#${tab}`).siblings().removeClass('active')
    $(`#${tab}`).addClass('active')
    let navHtml = ''
    let isNavigatable = navigation.filter(p => p.page == tab) ? true : false
    if (isNavigatable) {
        navHtml = navigation.filter(p => p.page == tab)[0].location
    } else {
        navHtml = navigation.filter(p => p.page == 'error404')[0].location
    }

    $('#pages').load(navHtml)
    // showSnackbar("normal", `Last updated data: ${localStorage.getItem('lastUpdate')}`);

}

async function preloadData() {
    if (errorCount >= 3) {
        localStorage.setItem('errorCount', '3')
        return

    }
    storedData = JSON.parse(localStorage.getItem('skylineData'))
    let isDataPresence = (storedData != '' && storedData != null) ? true : false

    if (isDataPresence == false) {
        await fetchSkylineData()
        // await fetchSkylineData(selectPhase)

        let _storedData = JSON.parse(localStorage.getItem('skylineData'))
        if (_storedData == '' || _storedData == null) {
            errorCount++
            localStorage.setItem('errorCount', errorCount)
        }

        await reloadPage()
    }
    else {
        if (moment(storedData.expiry).diff(Date.now()) < 0) {
            localStorage.removeItem('skylineData')
            await fetchSkylineData()
            let _storedData = JSON.parse(localStorage.getItem('skylineData'))
            if (_storedData == '' || _storedData == null) {
                errorCount++
                localStorage.setItem('errorCount', errorCount)
            }
            await reloadPage()

        }
        else {
            removeLoader()
            skylineData = storedData.data
        }
    }
    // console.log('pulled from storage ; ', skylineData)
}

async function preloadSummary() {
    if (errorCount >= 3) {
        localStorage.setItem('errorCount', '3')
        return
    }
    storedSummary = JSON.parse(localStorage.getItem('summaryData'))
    let isDataPresence = (storedSummary != '' && storedSummary != null) ? true : false

    if (isDataPresence == false) {
        await fetchSummary()

        let _storedSummary = JSON.parse(localStorage.getItem('summaryData'))
        if (_storedSummary == '' || _storedSummary == null) {
            errorCount++
            localStorage.setItem('errorCount', errorCount)
        }

        await reloadPage()
    }
    else {

        if (moment(storedSummary.expiry).diff(Date.now()) < 0) {
            localStorage.removeItem('summaryData')
            await fetchSummary()
            let _storedSummary = JSON.parse(localStorage.getItem('summaryData'))
            if (_storedSummary == '' || _storedSummary == null) {
                errorCount++
                localStorage.setItem('errorCount', errorCount)
            }
            await reloadPage()

        }
        else {
            removeLoader()
            summaryData = storedSummary.data
        }
    }
    // console.log('pulled from storage ; ', skylineData)
}

async function sumup() {
    // console.log(skylineData);
    let _phases = skylineData.map(x => x.Phase).distinct()
    let _locations = skylineData.map(x => x.Location).distinct()
    let _facilities = skylineData.map(x => x.Facility).distinct()

    RFCreports = _facilities.map(facility => {
        _filteredData = skylineData.filter(x => x.Facility == facility && x.Phase == 'RFC' && x.Location == 'ONV')
        dossierDone = _filteredData.filter(x => (x.FinalRFCApproved != null && x.FinalRFCApproved != '') || (x.PartialRFCApproved != null && x.PartialRFCApproved != ''))
        cow = _filteredData.filter(x => x.COW != null && x.COW != '')
        return {
            Facility: facility,
            ChecksheetTotal: _filteredData.map(x => x.TotalTotal)
                .reduce((sum, x) => (sum += parseInt(x))),
            ChecksheetDone: _filteredData.map(x => x.TotalDone)
                .reduce((sum, x) => (sum += parseInt(x))),
            DossierTotal: _filteredData.length,
            DossierDone: dossierDone.length,
            DossierDoneSubSystems: dossierDone
                .map(x => ({
                    SubSystem: x.SubSystem,
                    Description: x.Description,
                    HandOver: x.HandOver,
                    FinalApprovalDate: x.FinalRFCApproved,
                    PartialApprovalDate: x.PartialRFCApproved
                })),
            COW: cow.length,
            COWSubSystems: cow.map(x => ({
                SubSystem: x.SubSystem,
                Description: x.Description
            }))
        }
    })

    AOCreports = _facilities.map(facility => {
        _filteredData = skylineData.filter(x => x.Facility == facility && x.Phase == 'AOC' && x.Location == 'ONV')
        return {
            Facility: facility,
            ChecksheetTotal: _filteredData.map(x => x.TotalTotal)
                .reduce((sum, x) => (sum += parseInt(x))),
            ChecksheetDone: _filteredData.map(x => x.TotalDone)
                .reduce((sum, x) => (sum += parseInt(x))),
            DossierTotal: _filteredData.length,
            DossierDone: _filteredData.filter(x => x.FinalRFCApproved != null).length,
            DossierDoneSubSystems: _filteredData.filter(x => x.FinalRFCApproved != null)
                .map(x => ({
                    SubSystem: x.SubSystem,
                    Description: x.Description,
                    HandOver: x.HandOver,
                    FinalRFCApproved: x.FinalRFCApproved,
                    PartialRFCApproved: x.PartialRFCApproved
                })),
            COW: _filteredData.filter(x => x.COW != null).length,
            COWSubSystems: _filteredData.filter(x => x.COW != null).map(x => x.SubSystem)
        }
    })
    // console.log(skylineData)
    // console.log(RFCreports);
}

const tableSkyline = (tableElement, data) => {
    if (typeof table != "undefined" && table != null) {
        table.destroy();
    }

    // console.log(data)
    table = $(tableElement).DataTable({
        data: data,
        columns: [
            {
                data: null,
            },
            {
                data: "Index",
            },
            {
                data: "Phase",
            },
            {
                data: "Facility",
            },
            {
                data: "SubSystem",
            },
            {
                data: "Description",
            },
            {
                data: "Status",
            },
            {
                data: "Total",
            },
            {
                data: "ELE",
            },
            {
                data: "INS",
            },
            {
                data: "PVV",
            },
            {
                data: "BLD",
            },
            {
                data: "TEL",
            },
            {
                data: "SAF",
            },
            {
                data: "HVAC",
            },
            {
                data: "MEC",
            },
            {
                data: "Progress",
            },
            {
                data: "PLA",
            },
            {
                data: "PLB",
            },
            {
                data: "PLC",
            },
            {
                data: "PlanApproval",
            },
            {
                data: "ForecastWalkdown",
            },
            {
                data: "ReForecastWalkdown",
            },
            {
                data: "ActualWalkdown",
            },
            {
                data: "SentForReview",
            },
            {
                data: "PartialApproved",
            },
            {
                data: "FinalApproved",
            },
            {
                data: "COW",
            },
            {
                data: "HandOver",
            },
            // {
            //     data: "Status",
            // },
            {
                data: "Remarks",
            },
            // {
            //     data: "Comment1",
            // },
            // {
            //     data: "Comment2",
            // },
            // {
            //     data: "COW1",
            // },
            // {
            //     data: "ELEWalkdown",
            // },
            // {
            //     data: "INSWalkdown",
            // },
            // {
            //     data: "PVVWalkdown",
            // },
            // {
            //     data: "BLDWalkdown",
            // },
            // {
            //     data: "TELWalkdown",
            // },
            // {
            //     data: "SAFWalkdown",
            // },
            // {
            //     data: "HVACWalkdown",
            // },
            // {
            //     data: "MECWalkdown",
            // }
            // {
            //     data: "UpdatedDate",
            // },
        ],
        scrollX: true,
        columnDefs: [
            {
                targets: [4],
                render: function (data, type, row, meta) {
                    return `<div class="sub-system" data-action="open-modal">${data}</div>`;
                },
            },
            {
                targets: [5],
                className: "text-left",
                render: function (data, type, row, meta) {
                    return `<div class="no-wrap">${data}</div>`;
                },
            },
            {
                targets: [6],
                render: function (data, type, row, meta) {
                    if (data == "RFC signed") {
                        return `<span class="badge success text-sm">${data} </span>`;
                    }
                    else if (data == "Walkdown done")
                        return `<span class="badge warning text-sm">${data} </span>`;
                    else if (data != "")
                        return `<span class="badge text-sm">${data} </span>`;
                    else
                        return ""
                },
            },
            {
                targets: [7, 8, 9, 10, 11, 12, 13, 14, 15],
                render: function (data, type, row, meta) {
                    let _data = data ? data.split(" / ") : []
                    if (_data.length == 0)
                        return null

                    let percent = Math.floor(parseInt(_data[0]) * 100 / parseInt(_data[1]))
                    if (Number.isNaN(percent) || percent == 0) {
                        return type === "display"
                            ? '<div class="progress" style="height: 22px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:0%;">' + data + '</div></div>'
                            : data;
                    }

                    return type === "display"
                        ? '<div class="progress" style="height: 22px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
                        percent +
                        '%;">' +
                        data +
                        "</div></div>"
                        : data;
                },
            },
            {
                targets: [20, 21, 22, 23, 24, 25, 26],
                render: function (data, type, row, meta) {
                    if (isNaN(parseFloat(data)))
                        return null

                    return moment(data).format('DD-MMM-YY');
                },
            },
            {
                targets: [17],
                render: function (data, type, row, meta) {
                    let fg = "#000";
                    let _data = parseInt(data)
                    if (_data > 0) {
                        fg = "#ff0000";
                        return type === "display"
                            ? `<span style="font-weight: bold; color: ${fg};">${parseInt(data)}</span>`
                            : data;
                    }

                    return data

                },
            },
            {
                targets: [18],
                render: function (data, type, row, meta) {
                    let fg = "#000";
                    let _data = parseInt(data)
                    if (_data > 0) {
                        fg = "#fcc200";
                        return type === "display"
                            ? `<span style="font-weight: bold; color: ${fg};">${parseInt(data)}</span>`
                            : data;
                    }
                    return data
                },
            },
            {
                targets: [0, 1],
                visible: false,
                searchable: false,
            },

        ],
        deferRender: true,
        searching: true,
        paging: false,
        ordering: false,
        info: false,
        scrollX: "100%",
        scrollY: "72vh",
        scrollCollapse: true,
        createdRow: function (row, data, index) {
            if (data["FinalApproved"] != null && data["FinalApproved"] != '') {
                $(row).addClass("final");
            } else if (data["ActualWalkdown"] != null && data["ActualWalkdown"] != '') {
                $(row).addClass("walkdown");
            } else if (data["Progress"] > 80) {
                $(row).addClass("ready");
            }
        },
    });

    $('.dataTables_scrollBody').addClass('custom-scrollbar')
}

/**
 * Show flash snicky bar notification
 * @param {String} status (normal, error, success)
 * @param {Array} message 
 */
function showSnackbar(status = 'normal', message = null, duration = 2000) {

    // let successColor = "linear-gradient(to right, #4CAF50, #96c93d)";
    // let errorColor = "linear-gradient(to right, #FF6F00, #FF3D00)";
    // let normalColor = "linear-gradient(to right, #00b09b, #96c93d)";
    let successColor = "linear-gradient(to right, #4CAF50, #96c93d)";
    let errorColor = "linear-gradient(to right, #FF6F00, #FF3D00)";
    let normalColor = "linear-gradient(to right, #00b09b, #96c93d)";
    let color = normalColor;

    switch (status) {
        case 'error':
            color = errorColor;
            break;
        case 'success':
            color = successColor;
            break;
        default:
            color = normalColor;
            break;
    }

    if (message != null) {
        if (message instanceof Array) {
            message.forEach((msg) => {
                Toastify({
                    text: msg,
                    close: true,
                    duration: duration,
                    gravity: 'bottom',
                    position: 'center',
                    stopOnFocus: true, // Prevents dismissing of toast on hover            
                    style: {
                        background: color,
                    },
                    offset: {
                        x: 0,
                        y: 20
                    }
                    // onClick: function(){} // Callback after click
                }).showToast();
            })
        } else {
            Toastify({
                text: message,
                close: true,
                duration: duration,
                gravity: 'bottom',
                position: 'center',
                stopOnFocus: true, // Prevents dismissing of toast on hover            
                style: {
                    background: color,
                },
                offset: {
                    x: 0,
                    y: 20
                }
                // onClick: function(){} // Callback after click
            }).showToast();
        }
    }
}

Array.prototype.distinct = function (value, index, array) {
    // Method cannot be run on an array that does not exist.
    if (this == null) {
        throw new TypeError('this is null or not defined');
    }

    function _distinct(row, index, self) {
        return self.indexOf(row) === index;
    }

    return this.filter(_distinct);
}