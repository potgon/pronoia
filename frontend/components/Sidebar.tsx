import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

interface SidebarItem {
  id: string;
  title: string;
  icon: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isVisible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export default function Sidebar({ 
  items, 
  activeTab, 
  onTabChange, 
  isVisible, 
  onClose, 
  slideAnim 
}: SidebarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderSidebarItem = ({ item }: { item: SidebarItem }) => (
    <TouchableOpacity
      style={[
        styles.sidebarItem,
        activeTab === item.id && { backgroundColor: colors.tint + '20' }
      ]}
      onPress={() => {
        onTabChange(item.id);
        onClose();
      }}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={activeTab === item.id ? colors.tint : colors.tabIconDefault} 
      />
      <Text style={[
        styles.sidebarText,
        { color: activeTab === item.id ? colors.tint : colors.text }
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      style={[
        styles.sidebarOverlay,
        { 
          backgroundColor: isVisible ? 'rgba(0,0,0,0.3)' : 'transparent',
          pointerEvents: isVisible ? 'auto' : 'none',
        }
      ]}
      onTouchEnd={onClose}
    >
      <Animated.View 
        style={[
          styles.sidebar,
          { 
            backgroundColor: colors.card,
            transform: [{ translateX: slideAnim }],
          }
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={[styles.sidebarTitle, { color: colors.text }]}>Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={items}
          renderItem={renderSidebarItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sidebarContent}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  sidebarContent: {
    paddingVertical: 16,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  sidebarText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
