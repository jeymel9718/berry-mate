import { windowWidth } from "@/constants/Dimensions";
import { categoryDB } from "@/db/services/categories";
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

export type CategoryProps = {
  id: number;
  name: string;
  disabled: boolean;
  iconName: string;
};

type ContextualMenuCoord = { x: number; y: number };

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Category({ name, iconName, id, disabled }: CategoryProps) {
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

  const deleteCategory = async () => {
    await categoryDB.deleteCategory(db, id);
    setMenuVisible(false);
  };

  const editCategory = () => {
    router.navigate(`/categories/edit?id=${id}`);
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <Link href={`/categories/${name}?id=${id}`} asChild>
        <Pressable
          style={styles.iconContainer}
          onLongPress={disabled ? undefined : _handleLongPress}
        >
          <Icon source={iconName} size={windowWidth * 0.18} color="white" />
        </Pressable>
      </Link>
      <Menu
        anchor={contextualMenuCoord}
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
      >
        <Menu.Item
          onPress={editCategory}
          title="Edit"
          leadingIcon="note-edit"
        />
        <Menu.Item
          onPress={deleteCategory}
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
