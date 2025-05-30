import { BalanceHeader } from "@/components/BalanceHeader";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { SectionButton } from "@/components/SectionButton";
import { windowHeight, windowWidth } from "@/constants/Dimensions";
import { useEffect, useState } from "react";
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

const data = [
  { day: "Mon", income: 0, expenses: 0 },
  { day: "Tue", income: 0, expenses: 0 },
  { day: "Wed", income: 0, expenses: 0 },
  { day: "Thu", income: 0, expenses: 0 },
  { day: "Fri", income: 0, expenses: 0 },
  { day: "Sat", income: 0, expenses: 0 },
  { day: "Sun", income: 0, expenses: 0 },
];

const pieData = [
  { x: "Rent", y: 25, color: "blue" },
  { x: "Groceries", y: 15, color: "purple" },
  { x: "Entertainment", y: 20, color: "green" },
  { x: "Utilities", y: 10, color: "red" },
  { x: "Transport", y: 30, color: "yellow" },
];

export default function AnalysisScreen() {
  const db = useSQLiteContext();
  const font = useFont(roboto, 11);
  const yFont = useFont(italicRoboto, 9);

  const [grapData, setGrapData] = useState<DayTransaction[]>(data);
  const [selectedSegment, setSelectedSegment] = useState("Daily");
  const segments = ["Daily", "Weekly", "Monthly", "Year"];

  useEffect(() => {
    const updateData = async () => {
      const result = await transactionDB.getLastWeekTransactions(db);
      data.forEach((item) => {
        const dayData = result.find((d) => d.day === item.day);
        if (dayData) {
          item.income = dayData.income;
          item.expenses = dayData.expenses;
        } else {
          item.income = 0;
          item.expenses = 0;
        }
      });
      // Update the grapData state with the new data
      setGrapData(data);
    }

    updateData();
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
              data={grapData}
              xKey="day"
              yKeys={["income", "expenses"]}
              domainPadding={{ left: 20, right: 20 }}
              padding={{ bottom: 8, left: 8, right: 8 }}
              xAxis={{ font: font, lineColor: "transparent" }}
              yAxis={[{ font: yFont, formatYLabel: (t) => `${t / 1000}k` }]}
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
        <IncomeExpense income="" expense="" />
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
