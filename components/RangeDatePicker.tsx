import { Button, Dialog, Portal } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { useState } from "react";

export type RangeDatePickerProps = {
  visible: boolean;
  onApply: (range: { startDate: string; endDate: string }) => void;
  onCancel: () => void;
  onClear: () => void;
};

export function RangeDatePicker({
  visible,
  onApply,
  onCancel,
  onClear,
}: RangeDatePickerProps) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const onDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day.dateString < startDate) {
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  const generateMarkedDates = () => {
    const marked: any = {};
    if (startDate) {
      marked[startDate] = {
        startingDay: true,
        color: "#007bff",
        textColor: "white",
      };
    }
    if (endDate) {
      marked[endDate] = {
        endingDay: true,
        color: "#007bff",
        textColor: "white",
      };

      // fill in-between dates
      let current = new Date(startDate!);
      const end = new Date(endDate);
      while (current < end) {
        current.setDate(current.getDate() + 1);
        const dateString = current.toISOString().split("T")[0];
        if (dateString !== endDate) {
          marked[dateString] = { color: "#cce5ff", textColor: "black" };
        }
      }
    }
    return marked;
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Icon icon="calendar" />
        <Dialog.Title>Choose a date range</Dialog.Title>
        <Dialog.Content>
          <Calendar
            onDayPress={onDayPress}
            markingType={"period"}
            markedDates={generateMarkedDates()}
            theme={{
              todayTextColor: "#007bff",
              arrowColor: "#007bff",
            }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            disabled={!startDate}
            onPress={() => {
              setStartDate(null);
              setEndDate(null);
              onClear();
            }}
          >
            Clear
          </Button>
          <Button onPress={onCancel}>Cancel</Button>
          <Button
            disabled={!(startDate && endDate)}
            onPress={() =>
              onApply({ startDate: startDate!, endDate: endDate! })
            }
          >
            Apply
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
