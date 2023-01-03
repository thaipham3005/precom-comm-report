function removeLoader() {
    $('#page-loader').addClass('hidden')
}

function invokeLoader() {
    $('#page-loader').removeClass('hidden')
}

async function reloadPage() {
    await navigate(selectTab)
    // await window.location.reload()

}

async function fetchSkylineData(phase = null, facility = null, discipline = null) {
    let fetchAPI = API.filter(x => x.host == service)[0].data.skylineData
    let paramQuery = ''
    paramQuery = phase ? `Phase=${phase}&` : ''
    paramQuery += facility ? `Facility=${facility}&` : ''
    paramQuery += discipline ? `Discipline=${discipline}&` : ''

    if (paramQuery.slice(-1) == '&') { paramQuery = paramQuery.slice(0, -1) }

    fetchAPI = fetchAPI + '?' + paramQuery

    // console.log(fetchAPI)

    await fetch(fetchAPI)
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('skylineData', JSON.stringify({
                data: data,
                expiry: moment(new Date()).add(8, 'hours')
            }))
            isDataPresence = true
            skylineData = data
            console.log('fetched : ', skylineData)

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
    preloadData()
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

}

async function preloadData() {
    if (errorCount >= 3) {
        localStorage.setItem('errorCount', '3')
        return

    }
    storedData = JSON.parse(localStorage.getItem('skylineData'))
    isDataPresence = (storedData != '' && storedData != null) ? true : false

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
            await fetchSkylineData(selectPhase)
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

async function summary() {

}

const tableSkyline = (tableElement, data) => {
    if (typeof table != "undefined" && table != null) {
        table.destroy();
    }
    table = $(tableElement).DataTable({
        data: data,
        columns: [
            {
                data: "__id",
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
                data: "Progress",
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
                data: "Priority",
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
                data: "PlanRFC",
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
                data: "PartialApproved",
            },
            {
                data: "FinalApproved",
            },
            {
                data: "COW",
            },
            {
                data: "Handover",
            },
            // {
            //     data: "WalkdownLeader",
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
                    return `${data}%`;
                },
            },
            // {
            //     targets: [6],
            //     data: "Progress",
            //     render: function (data, type, row, meta) {
            //         let percent = parseFloat(data);
            //         if (Number.isNaN(percent) || percent == 0) {
            //             return type === "display"
            //                 ? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:0%;">0%</div></div>'
            //                 : percent;
            //         }

            //         return type === "display"
            //             ? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
            //             percent +
            //             '%;">' +
            //             percent +
            //             "%</div></div>"
            //             : percent;
            //     },
            // },
            {
                targets: [7, 8, 9, 10, 11, 12, 13, 14, 15],
                render: function (data, type, row, meta) {
                    let _data = data ? data.split(" / ") : []
                    if (_data.length == 0)
                        return null

                    let percent = Math.floor(parseInt(_data[0]) * 100 / parseInt(_data[1]))
                    if (Number.isNaN(percent) || percent == 0) {
                        return type === "display"
                            ? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:0%;">' + data + '</div></div>'
                            : data;
                    }

                    return type === "display"
                        ? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
                        percent +
                        '%;">' +
                        data +
                        "</div></div>"
                        : data;
                },
            },
            // {
            //     targets: [16, 17, 18, 19],
            //     render: function (data, type, row, meta) {
            //         if (isNaN(parseFloat(data)))
            //             return null

            //         return parseFloat(data).toLocaleString("en-US");
            //     },
            // },
            {
                targets: [20, 21, 22, 23, 24, 25],
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
        scrollY: "65vh",
        scrollCollapse: true,
        createdRow: function (row, data, index) {
            if (data["FinalApproved"] != null) {
                $(row).addClass("final");
            } else if (data["ActualWalkdown"] != null) {
                $(row).addClass("walkdown");
            } else if (data["Progress"] > 80) {
                $(row).addClass("ready");
            }
        },
    });

    $('.dataTables_scrollBody').addClass('custom-scrollbar')
}