import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { ScreenProps } from "../navigation";
import type { Meal, Profile } from "../types";
import {
  getProfile,
  getTodaysMeals,
  loadSampleMeals,
} from "../services/meals";
import { useAuth } from "../context/AuthContext";
import { MacroBar } from "../components/MacroBar";
import { ProgressBar } from "../components/ProgressBar";
import { MealCard } from "../components/MealCard";
import { colors } from "../theme";

export function DashboardScreen({ navigation }: ScreenProps<"Dashboard">) {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([getProfile(), getTodaysMeals()]);
      setProfile(p);
      setMeals(m);
    } catch (err: any) {
      Alert.alert("Could not load data", err.message ?? String(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + Number(m.protein_g),
      carbs: acc.carbs + Number(m.carbs_g),
      fat: acc.fat + Number(m.fat_g),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const calorieGoal = profile?.daily_calorie_goal ?? 2000;
  const remaining = Math.max(calorieGoal - totals.calories, 0);

  const onLoadSamples = async () => {
    try {
      await loadSampleMeals();
      await load();
    } catch (err: any) {
      Alert.alert("Could not add samples", err.message ?? String(err));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const header = (
    <View>
      <View style={styles.topRow}>
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting} numberOfLines={1}>
            Hi{profile?.full_name ? `, ${profile.full_name}` : ""} 👋
          </Text>
          <Text style={styles.date} numberOfLines={1}>
            {new Date().toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.iconBtn}
            accessibilityLabel="Edit goals"
          >
            <Ionicons name="settings-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={signOut}
            style={styles.iconBtn}
            accessibilityLabel="Sign out"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Calories today</Text>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieValue}>{totals.calories}</Text>
          <Text style={styles.calorieGoal}> / {calorieGoal} kcal</Text>
        </View>
        <ProgressBar
          value={totals.calories}
          goal={calorieGoal}
          color={colors.primary}
          height={12}
        />
        <Text style={styles.remaining}>{remaining} kcal remaining</Text>

        <View style={styles.divider} />

        <MacroBar
          label="Protein"
          value={totals.protein}
          goal={profile?.daily_protein_goal ?? 120}
          color={colors.protein}
        />
        <MacroBar
          label="Carbs"
          value={totals.carbs}
          goal={profile?.daily_carb_goal ?? 220}
          color={colors.carbs}
        />
        <MacroBar
          label="Fat"
          value={totals.fat}
          goal={profile?.daily_fat_goal ?? 70}
          color={colors.fat}
        />
      </View>

      <TouchableOpacity
        style={styles.coachButton}
        onPress={() => navigation.navigate("Coach")}
        activeOpacity={0.85}
      >
        <Text style={styles.coachButtonText}>🍽️  Ask the AI coach</Text>
        <Text style={styles.coachButtonArrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Today's meals</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={meals}
        keyExtractor={(m) => m.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            onPress={() => navigation.navigate("MealDetail", { meal: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No meals logged yet</Text>
            <Text style={styles.emptyText}>
              Snap a photo of your food to get started.
            </Text>
            <TouchableOpacity
              style={styles.sampleButton}
              onPress={onLoadSamples}
            >
              <Text style={styles.sampleButtonText}>Load sample meals</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.primary}
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddMeal")}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>＋ Snap a meal</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  list: { padding: 20, paddingBottom: 110 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  greetingWrap: { flex: 1, marginRight: 10 },
  greeting: { fontSize: 22, fontWeight: "800", color: colors.text },
  date: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  topActions: { flexDirection: "row", gap: 10, flexShrink: 0 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  coachButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 22,
  },
  coachButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  coachButtonArrow: { color: "#fff", fontSize: 22, fontWeight: "800" },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
  },
  summaryLabel: { fontSize: 14, color: colors.textMuted, fontWeight: "600" },
  calorieRow: { flexDirection: "row", alignItems: "flex-end", marginVertical: 6 },
  calorieValue: { fontSize: 36, fontWeight: "800", color: colors.primary },
  calorieGoal: { fontSize: 16, color: colors.textMuted, marginBottom: 6 },
  remaining: { fontSize: 13, color: colors.textMuted, marginTop: 8 },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  empty: { alignItems: "center", paddingVertical: 30 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  sampleButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  sampleButtonText: { color: colors.primaryDark, fontWeight: "700" },
  fab: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
