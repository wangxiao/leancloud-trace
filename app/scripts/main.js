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
    var beginTime = '201410241500';
    var endTime = '201410241800';
    var treeData = [];

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

    var chartPie;
    var chartLine;

    function initPie() {
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
                // formatter: "{a} <br/>{b} : {c} ({d}%)"
                formatter: "{a}：{d}%<br/>{b}<br/>点击显示波动数据"
            },
            calculable : true,
        };
        chartPie = ec.init(document.getElementById('root-tree-pie'));
        chartPie.setOption(pieOption);
        chartPie.on('click', function(data) {
            getLineData(treeData[data.dataIndex].pathid, treeData[data.dataIndex].method).done(function(data) {
                showCostLine(data);
            });
        });
    }
    
    function initLine() {
        // 初始化线形图
        var lineOption = {
            color: colorTheme,
            tooltip : {
                trigger: 'axis'
            },
            yAxis : [
                {
                    type : 'value'
                }
            ],
            dataZoom: {
                show: true
            }
        };
        chartLine = ec.init(document.getElementById('show-detail'));
        chartLine.setOption(lineOption);        
    }

    function getTreeData(id) {
        if (!id) {
            id = '#';
        }
        return $.ajax({
           url: host + '/trace/method-tree?begin=' + beginTime + '&end=' + endTime + '&pathid=' + id,
           xhrFields: {
              withCredentials: true
           }
        }).done(function(data) {
            if (data.length) {
                treeData = data;
            }
            // console.log('method-tree data:');
            // console.log(data);
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

    function getLineData(id, method) {
        return $.ajax({
            url: host + '/trace/method-stack?begin=' + beginTime + '&end=' + endTime + '&pathid=' + id + '&method=' + method,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            // console.log('method-stack data:');
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
                show: true,
                itemStyle: {
                    show: true,
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
        initLine();
        var opts = chartLine.getOption();
        opts.legend = {
            data: names
        };
        opts.xAxis = [{
            type: 'category',
            boundaryGap: false,
            data: data.times
        }];

        chartLine.setOption(opts, true);
        chartLine.setSeries(lineSeries);
    }

    function updatePie(id) {
        getTreeData(id).done(function(data) {
            if (data.length) {
                showCostPie(data);
                showLineFirst(data);
            }
        });   
    }

    function showLineFirst(data0, i) {
        if (arguments.length < 2) {
            i = 0;
        } else if (i >= data0.length) {
            return;
        }
        getLineData(data0[i].pathid, data0[i].method).done(function(data) {
            if (data.times.length) {
                showCostLine(data);
            } else {
                i ++;
                showLineFirst(data0, i);
            }
        });
    }

    // 运行逻辑
    initPie();
    updatePie();
});
