import { BalanceHeader } from "@/components/BalanceHeader";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { SectionButton } from "@/components/SectionButton";
import { windowHeight, windowWidth } from "@/constants/Dimensions";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { BarGroup, CartesianChart, Pie, PolarChart } from "victory-native";
import { useFont } from "@shopify/react-native-skia";

import roboto from "@/assets/fonts/Roboto-Regular.ttf";
import italicRoboto from "@/assets/fonts/Roboto-Italic.ttf";
import { IncomeExpense } from "@/components/analysis/IncomeExpense";
import React from "react";
import { PieLabel } from "@/components/analysis/PieLabel";
import { PieTags } from "@/components/analysis/PieTags";
import { useSQLiteContext } from "expo-sqlite";
import { DayTransaction, transactionDB } from "@/db/services/transaction";
import { categoryDB } from "@/db/services/categories";
import { getUniquePieColor } from "@/utils/utils";

const data = [
  { day: "Mon", income: 0, expenses: 0 },
  { day: "Tue", income: 0, expenses: 0 },
  { day: "Wed", income: 0, expenses: 0 },
  { day: "Thu", income: 0, expenses: 0 },
  { day: "Fri", income: 0, expenses: 0 },
  { day: "Sat", income: 0, expenses: 0 },
  { day: "Sun", income: 0, expenses: 0 },
];

const weeklyData = [
  { week: "Week 1", income: 0, expenses: 0 },
  { week: "Week 2", income: 0, expenses: 0 },
  { week: "Week 3", income: 0, expenses: 0 },
  { week: "Week 4", income: 0, expenses: 0 },
];
const monthlyData = [
  { month: "Jan", income: 0, expenses: 0 },
  { month: "Feb", income: 0, expenses: 0 },
  { month: "Mar", income: 0, expenses: 0 },
  { month: "Apr", income: 0, expenses: 0 },
  { month: "May", income: 0, expenses: 0 },
  { month: "Jun", income: 0, expenses: 0 },
  { month: "Jul", income: 0, expenses: 0 },
  { month: "Aug", income: 0, expenses: 0 },
  { month: "Sep", income: 0, expenses: 0 },
  { month: "Oct", income: 0, expenses: 0 },
  { month: "Nov", income: 0, expenses: 0 },
  { month: "Dec", income: 0, expenses: 0 },
];

export default function AnalysisScreen() {
  const db = useSQLiteContext();
  const font = useFont(roboto, 11);
  const yFont = useFont(italicRoboto, 9);

  const [maxPoint, setMaxPoint] = useState(0);
  const [pieData, setPieData] = useState<
    { x: string; y: number; color: string }[]
  >([]);
  const [graphData, setGraphData] = useState<any[]>(data);
  const [totalData, setTotalData] = useState<{
    income: number;
    expenses: number;
  }>({
    income: 0,
    expenses: 0,
  });
  const [xtickCount, setXtickCount] = useState(7);
  const [selectedSegment, setSelectedSegment] = useState("Daily");
  const segments = ["Daily", "Weekly", "Monthly", "Year"];

  // Fetch data directly from DB
  const getDataBySegment = async (segment: string) => {
    let baseData: any = [];
    let key = "";
    let dbFunction: any = null;
    switch (segment) {
      case "Daily":
        baseData = [...data];
        key = "day";
        dbFunction = transactionDB.getDailyTransactions;
        break;
      case "Weekly":
        baseData = [...weeklyData];
        key = "week";
        dbFunction = transactionDB.getWeeklyTransactions;
        break;
      case "Monthly":
        baseData = [...monthlyData];
        key = "month";
        dbFunction = transactionDB.getMonthlyTransactions;
        break;
      case "Year":
        baseData = [];
        key = "year";
        dbFunction = transactionDB.getYearlyTransactions;
        break;
      default:
        baseData = [...data];
        key = "day";
        dbFunction = transactionDB.getDailyTransactions;
    }

    // Fetch and merge the data
    const result = await dbFunction(db);
    let totalIncome = 0;
    let totalExpenses = 0;
    let maxPoint = 0;
    result.forEach((point: any) => {
      maxPoint = Math.max(maxPoint, point.income || 0, point.expenses || 0);
      totalIncome += point.income || 0;
      totalExpenses += point.expenses || 0;
      const index = baseData.findIndex((item: any) => item[key] === point[key]);
      if (index !== -1) {
        baseData[index].income += point.income || 0;
        baseData[index].expenses += point.expenses || 0;
      } else {
        baseData.push({
          [key]: point[key],
          income: point.income || 0,
          expenses: point.expenses || 0,
        });
      }
    });
    setMaxPoint(maxPoint + maxPoint * 0.1); // Add 10% buffer to max point
    setTotalData({ income: totalIncome, expenses: totalExpenses });
    return baseData;
  };

  useEffect(() => {
    const updateData = async () => {
      const data = await getDataBySegment(selectedSegment);
      setXtickCount(data.length);
      setGraphData(data || []);
    };

    updateData();
  }, [selectedSegment]);

  useEffect(() => {
    const fetchPieData = async () => {
      // Fetch top categories from the database
      const categories = await categoryDB.getTopCategories(db);
      const formattedPieData = categories
        .filter(
          (category) =>
        category.percentage > 0 &&
        category.total_expense > 0 &&
        category.percentage !== undefined &&
        category.total_expense !== undefined
        )
        .map((category) => ({
          x: category.category,
          y: Math.ceil(category.percentage),
          color: getUniquePieColor(category.category),
        }));
      setPieData(formattedPieData);
    };
    fetchPieData();
  }, []);

  const xKey = useMemo(() => {
    switch (selectedSegment) {
      case "Daily":
        return "day";
      case "Weekly":
        return "week";
      case "Monthly":
        return "month";
      case "Year":
        return "year";
      default:
        return "day";
    }
  }, [selectedSegment]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <View
          style={{
            paddingTop: 30,
            alignItems: "center",
            justifyContent: "flex-start",
            height: "100%",
          }}
        >
          <BalanceHeader />
        </View>
      }
      headerHeight={160}
    >
      <View style={styles.mainChartCtn}>
        <SectionButton
          value={selectedSegment}
          segments={segments}
          onValueChange={(value: string) => setSelectedSegment(value)}
        />
        <Surface style={styles.incomesContainer}>
          <Text variant="titleSmall">Incomes & Expenses</Text>
          <View style={styles.chartContainer}>
            <CartesianChart
              data={graphData}
              xKey={xKey}
              yKeys={["income", "expenses"]}
              domainPadding={{ left: 20, right: 20 }}
              padding={{ bottom: 8, left: 8, right: 8 }}
              xAxis={{
                font: font,
                lineColor: "transparent",
                tickCount: xtickCount,
              }}
              yAxis={[
                {
                  font: yFont,
                  formatYLabel: (t) => `${t / 1000}k`,
                  domain: [0, maxPoint],
                },
              ]}
            >
              {({ points, chartBounds }) => (
                <BarGroup
                  chartBounds={chartBounds}
                  betweenGroupPadding={0.5}
                  withinGroupPadding={0.3}
                  roundedCorners={{ topLeft: 10, topRight: 10 }}
                >
                  <BarGroup.Bar points={points.income} color="green" />
                  <BarGroup.Bar points={points.expenses} color="blue" />
                </BarGroup>
              )}
            </CartesianChart>
          </View>
        </Surface>
        <IncomeExpense income={totalData.income} expense={totalData.expenses} />
      </View>
      <Text variant="titleMedium">Top Categories</Text>
      <View style={styles.chartContainer}>
        <PolarChart data={pieData} labelKey="x" valueKey="y" colorKey="color">
          <Pie.Chart>
            {({ slice }) => {
              return (
                <>
                  <Pie.Slice>
                    <Pie.Label font={font} color={"black"}>
                      {(position) => (
                        <PieLabel
                          position={position}
                          slice={slice}
                          font={font}
                        />
                      )}
                    </Pie.Label>
                  </Pie.Slice>
                  <Pie.SliceAngularInset
                    angularInset={{
                      angularStrokeWidth: 2,
                      angularStrokeColor: "white",
                    }}
                  />
                </>
              );
            }}
          </Pie.Chart>
        </PolarChart>
      </View>
      <PieTags data={pieData} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mainChartCtn: {
    gap: 10,
    marginBottom: 12,
  },
  incomesContainer: {
    backgroundColor: "#DFF7E2",
    gap: 2,
    padding: 8,
    borderRadius: 15,
  },
  chartContainer: {
    height: windowHeight * 0.22,
    width: windowWidth * 0.8,
  },
});
