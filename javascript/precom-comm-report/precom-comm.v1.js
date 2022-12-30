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
                data: "TotalDone",
            },
            {
                data: "Progress",
            },
            {
                data: "ELEDone",
            },
            {
                data: "INSDone",
            },
            {
                data: "PVVDone",
            },
            {
                data: "BLDDone",
            },
            {
                data: "TELDone",
            },
            {
                data: "SAFDone",
            },
            {
                data: "HVACDone",
            },
            {
                data: "MECDone",
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
                data: "HO",
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
                targets: [16, 17, 18, 19],
                render: function (data, type, row, meta) {
                    if (isNaN(parseFloat(data)))
                        return null

                    return parseFloat(data).toLocaleString("en-US");
                },
            },
            {
                targets: [20, 21, 22, 23, 24, 25],
                render: function (data, type, row, meta) {
                    if (isNaN(parseFloat(data)))
                        return null

                    return moment(data).format('DD-MMM-YY');
                },
            },
            {
                targets: [3],
                className: "text-left",
            },
            {
                targets: [7],
                data: "Progress",
                render: function (data, type, row, meta) {
                    let percent = parseFloat(data);
                    if (Number.isNaN(percent) || percent == 0) {
                        return type === "display"
                            ? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:0%;">0%</div></div>'
                            : percent;
                    }

                    return type === "display"
                        ? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
                        percent +
                        '%;">' +
                        percent +
                        "%</div></div>"
                        : percent;
                },
            },
            // {
            //     targets: [16],
            //     data: "CPI",
            //     render: function (data, type, row, meta) {
            //         let bg = "transparent";
            //         if (data > 1) {
            //             bg = "#28a745";
            //         } else if (data == 1) {
            //             bg = "#ffc107";
            //         } else {
            //             bg = "#dc3545";
            //         }
            //         return type === "display"
            //             ? `<span style="color: ${bg};">${parseFloat(data).toFixed(
            //                 2
            //             )}</span>`
            //             : data;
            //     },
            // },
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
        // createdRow: function (row, data, index) {
        //     if (data["Level"] == "4") {
        //         $(row).attr("level", 4);
        //     } else {
        //         $(row).attr("level", data["Level"]);
        //         $(row).attr("collapsed", false);
        //     }
        // },
    });
}