require.config({
    paths: {
        echarts: 'http://echarts.baidu.com/build/dist'
    }
});
require([
    'echarts',
    'echarts/chart/pie',
    'echarts/chart/line'
],
function (ec) {
    var host = 'http://trace.avoscloud.com';
    var colorTheme = [
        "#2ec7c9",
        "#b6a2de",
        "#5ab1ef",
        "#ffb980",
        "#d87a80",
        "#8d98b3",
        "#e5cf0d",
        "#97b552",
        "#95706d",
        "#dc69aa",
        "#07a2a4",
        "#9a7fd1",
        "#588dd5",
        "#f5994e",
        "#c05050",
        "#59678c",
        "#c9ab00",
        "#7eb00a",
        "#6f5553",
        "#c14089"
    ];

    // 初始化饼状图
    var pieOption = {
        // title : {
        //     text: '某站点用户访问来源',
        //     subtext: '纯属虚构',
        //     x:'center'
        // },
        color: colorTheme,
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable : true,
    };
    var chartPie = ec.init(document.getElementById('root-tree'));
    chartPie.setOption(pieOption);

    // 初始化线形图
    var lineOption = {
        // title : {
        //     text: '某楼盘销售情况',
        //     subtext: '纯属虚构'
        // },
        color: colorTheme,
        tooltip : {
            trigger: 'axis'
        },
        // calculable : true,
        yAxis : [
            {
                type : 'value'
            }
        ]
    };
    var chartLine = ec.init(document.getElementById('show-detail'));
    chartLine.setOption(lineOption);

    function getTreeData(id) {
        if (!id) {
            id = '#';
        }
        return $.ajax({
           url: host + '/trace/method-tree?begin=201410241500&end=201410241800&pathid=' + id,
           xhrFields: {
              withCredentials: true
           }
        }).done(function(data) {
            console.log(data);
        });
    }

    function showCostPie(data) {
        var pieSeries = [{
            name:'运行时间占比',
            type:'pie',
            // radius : '60%',
            // center: ['45%', '60%'],
            data:[]
        }];
        $.each(data, function(i, v) {
            pieSeries[0].data[i] = {
                name: v.text,
                value: v.cost
            };
        });
        chartPie.setSeries(pieSeries);
    }

    function getLineData() {
        return $.ajax({
           url: host + '/trace/method-stack?begin=201410241500&end=201410241800&pathid=190c22493e2e8312d76495688c620022&method=uluru-api.app-storage-meta/permissions-%3Eacl',
           xhrFields: {
              withCredentials: true
           }
        }).done(function(data) {
            // console.log(data);
        });
    }

    function showCostLine(data) {
        var lineSeries = [];
        $.each(data.series, function(i, v) {
            lineSeries[i] = {
                name: v.name,
                data: v.data,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                }
            };
        });
        var names = [];
        $.each(lineSeries, function(i, v) {
            names[i] = lineSeries[i].name;
        });
        var opts = {
            legend: {
                data: names
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: data.times
                }
            ]            
        };
        chartLine.setOption(opts);
        chartLine.setSeries(lineSeries);
    }

    getTreeData().done(function(data) {
        showCostPie(data);
    });

    getLineData().done(function(data) {
        // data = {"series":[{"name":"uluru-api.handlers.objects\/with-check-permission","data":[9813847,18199304,7312268,7521416,6507326,6317993,6369038,7565387,6553377,6911943,12418986]},{"name":"uluru-api.handlers.endpoint\/send-stats-event","data":[12887354,719261,668045,983221,712984,716103,732451,794298,764182,1037906,1079714]},{"name":"query-objects","data":[10610668,19078955,8152946,8887898,7385767,7183091,7259238,8612113,7508798,8118135,13674292]}],"times":["15:48","15:49","15:50","15:51","15:52","15:53","15:54","15:55","15:56","15:57","15:58"]};
        // console.log(data);
        showCostLine(data);
    });

});
