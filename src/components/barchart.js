import React, { useRef, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";

const BarChart = ({ data: customData }) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || rootRef.current) return;

    let root = am5.Root.new(chartRef.current);
    rootRef.current = root;
    
    const myTheme = am5.Theme.new(root);
    myTheme.rule("AxisLabel", ["minor"]).setAll({ dy: 1 });
    root.setThemes([am5themes_Animated.new(root), myTheme, am5themes_Responsive.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        layout: root.verticalLayout
      })
    );

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "none" }));
    cursor.lineY.set("visible", false);

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0,
        baseInterval: { timeUnit: "hour", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {
          forceHidden: true
        })
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, { 
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {
          forceHidden: true
        })
      })
    );

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
          getFillFromSprite: false,
          getStrokeFromSprite: true,
          getLabelFillFromSprite: false,
          background: am5.Rectangle.new(root, {
            fill: am5.color(0x000000),
            fillOpacity: 0.7,
            stroke: am5.color(0xffffff),
            strokeWidth: 1,
            cornerRadius: 5
          })
        })
      })
    );

    series.columns.template.adapters.add("fill", (fill, target) => {
      let value = target.dataItem?.get("valueY") || 0;
      if (value <= 50) return am5.color("#00FF00");
      if (value <= 100) return am5.color("#FFFF00");
      if (value <= 150) return am5.color("#FFA500");
      if (value <= 200) return am5.color("#FF0000");
      if (value <= 300) return am5.color("#800080");
      return am5.color("#654321");
    });

    series.columns.template.setAll({ 
      strokeOpacity: 0,
      width: am5.percent(80) // Tăng độ rộng của cột lên 80% khoảng cách giữa các cột
    });

    // Add hover effect to dim the bars
    series.columns.template.events.on("pointerover", (event) => {
      event.target.set("fillOpacity", 0.5);
    });

    series.columns.template.events.on("pointerout", (event) => {
      event.target.set("fillOpacity", 1);
    });

    let data = customData?.map(item => ({
      date: new Date(item.date).getTime(),
      value: item.value
    })) || [];

    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
      rootRef.current = null
    };
  }, [customData]);

  return <div ref={chartRef} style={{ width: "100%", height: "140px" }}></div>;
};

export default BarChart;