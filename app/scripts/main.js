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
        legend: {
            data:['意向','预购','成交']
        },
        // calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ]
    };
    var chartLine = ec.init(document.getElementById('show-detail'));
    chartLine.setOption(lineOption);

    $.ajax({
       url: 'http://trace.avoscloud.com/trace/method-tree?begin=201410241500&end=201410241800&pathid=%23',
       xhrFields: {
          withCredentials: true
       }
    }).done(function(data) {
        console.log(data);
    }).fail(function(data) {
        console.log(data);
    });

    var pieSeries = [{
        name:'访问来源',
        type:'pie',
        radius : '40%',
        center: ['45%', '30%'],
        data:[
            {value:335, name:'直1231问'},
            {value:310, name:'邮件营销'},
            {value:234, name:'联盟广告'},
            {value:135, name:'视频广告'},
            {value:1548, name:'搜索引擎'}
        ]
    }];
    chartPie.setSeries(pieSeries);


    var lineSeries = [
        {
            name:'成交',
            type:'line',
            smooth:true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data:[10, 12, 21, 54, 260, 830, 710]
        },
        {
            name:'预购',
            type:'line',
            smooth:true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data:[30, 182, 434, 791, 390, 30, 10]
        },
        {
            name:'意向',
            type:'line',
            smooth:true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data:[1320, 1132, 601, 234, 120, 90, 20]
        }
    ];
    chartLine.setSeries(lineSeries);

});
