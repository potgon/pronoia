import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

interface CustomHeaderProps {
  title: string;
  onMenuPress: () => void;
  leftComponent?: React.ReactNode;
}

export default function CustomHeader({ title, onMenuPress, leftComponent }: CustomHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.leftContainer}>
        {leftComponent}
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <View style={styles.menuIconContainer}>
          <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 56,
    paddingTop: 8,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuIconContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
});
