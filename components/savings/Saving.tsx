import { windowWidth } from "@/constants/Dimensions";
import { savingDb } from "@/db/services/savings";
import { Link, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Icon, Menu, Text } from "react-native-paper";

export type SavingProps = {
  name: string;
  iconName: string;
  id: number;
};

type ContextualMenuCoord = { x: number; y: number };

export function Saving({ name, iconName, id }: SavingProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [contextualMenuCoord, setContextualMenuCoor] =
    useState<ContextualMenuCoord>({ x: 0, y: 0 });
  const db = useSQLiteContext();

  const _handleLongPress = (event: GestureResponderEvent) => {
    const { nativeEvent } = event;
    setContextualMenuCoor({
      x: nativeEvent.pageX,
      y: nativeEvent.pageY,
    });
    setMenuVisible(true);
  };

  const editSaving = () => {
    router.navigate(`/categories/edit?id=${id}&savings=true`);
    setMenuVisible(false);
  };

  const deleteSaving = async () => {
    await savingDb.deleteSaving(db, id);
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <Link href={`/categories/savings/${name}?id=${id}`} asChild>
        <Pressable style={styles.iconContainer} onLongPress={_handleLongPress}>
          <Icon source={iconName} size={windowWidth * 0.18} color="white" />
        </Pressable>
      </Link>
      <Menu
        anchor={contextualMenuCoord}
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
      >
        <Menu.Item
          onPress={editSaving}
          title="Edit"
          leadingIcon="note-edit"
        />
        <Menu.Item
          onPress={deleteSaving}
          title="Delete"
          leadingIcon="delete"
        />
      </Menu>
      <Text variant="labelLarge">{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#6DB6FE",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
