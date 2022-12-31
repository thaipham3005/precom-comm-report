const tableSkyline = (tableElement, data) => {

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
        info: true,
        scrollX: "100%",
        scrollY: "60vh",
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
}