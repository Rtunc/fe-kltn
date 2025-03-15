import React, { useRef, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const AQIGaugeChart = ({ value }) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const axisDataItemRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || rootRef.current) return;
    
    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: 160,
        endAngle: 380,
      })
    );

    const axisRenderer = am5radar.AxisRendererCircular.new(root, { innerRadius: -40 });
    axisRenderer.grid.template.setAll({
      stroke: root.interfaceColors.get("background"),
      visible: true,
      strokeOpacity: 0.8,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: 500,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      fontSize: 16,  // Tăng kích thước chữ
      fontWeight: "bold",
      fill: am5.color("#ffffff"), // Màu chữ trắng
    });
    const axisDataItem = xAxis.makeDataItem({});
    axisDataItemRef.current = axisDataItem;

    const clockHand = am5radar.ClockHand.new(root, {
      pinRadius: am5.percent(16),
      radius: am5.percent(80),
      bottomWidth: 20,
    });

    const bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, { sprite: clockHand }));
    xAxis.createAxisRange(axisDataItem);

    const label = chart.radarContainer.children.push(
      am5.Label.new(root, {
        fill: am5.color(0xffffff),
        centerX: am5.percent(50),
        textAlign: "center",
        centerY: am5.percent(50),
        fontSize: "1em",
      })
    );

    axisDataItem.set("value", value);
    bullet.get("sprite").on("rotation", () => {
      label.set("text", Math.round(axisDataItem.get("value")).toString());
    });

    const bandsData = [
      { title: "Tốt", color: "#00E400", lowScore: 0, highScore: 50 },
      { title: "Trung bình", color: "#FFFF00", lowScore: 50, highScore: 100 },
      { title: "Kém", color: "#FF7E00", lowScore: 100, highScore: 150 },
      { title: "Xấu", color: "#FF0000", lowScore: 150, highScore: 200 },
      { title: "Rất kém", color: "#8F3F97", lowScore: 200, highScore: 300 },
      { title: "Nguy hại", color: "#7E0023", lowScore: 300, highScore: 500 },
    ];

    bandsData.forEach((data) => {
      const axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
      axisRange.setAll({ value: data.lowScore, endValue: data.highScore });
      axisRange.get("axisFill").setAll({ fill: am5.color(data.color), fillOpacity: 0.8 });
      axisRange.get("label").setAll({ text: data.title, inside: true, radius: 15, fontSize: "x" });
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
      rootRef.current = null;
      axisDataItemRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (axisDataItemRef.current) {
      axisDataItemRef.current.set("value", value);
    }
  }, [value]);

  return <div id="chartdiv" style={{ width: "100%", height: "200px" }} ref={chartRef}></div>;
};

export default AQIGaugeChart;