import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';

export default function NewsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(280)).current;

  const sidebarItems = [
    { id: 'all', title: 'All News', icon: 'newspaper' },
    { id: 'market', title: 'Market News', icon: 'trending-up' },
    { id: 'earnings', title: 'Earnings', icon: 'calendar' },
    { id: 'analyst', title: 'Analyst Reports', icon: 'document-text' },
    { id: 'sector', title: 'Sector News', icon: 'git-branch' },
    { id: 'economy', title: 'Economic', icon: 'business' },
    { id: 'crypto', title: 'Crypto', icon: 'logo-bitcoin' },
  ];

  const mockNews = [
    {
      id: '1',
      title: 'Apple Reports Strong Q4 Earnings, iPhone Sales Exceed Expectations',
      summary: 'Apple Inc. reported quarterly earnings that beat analyst estimates, driven by strong iPhone sales and services revenue growth.',
      source: 'Reuters',
      timeAgo: '2 hours ago',
      category: 'earnings',
      image: 'https://via.placeholder.com/300x200',
      readTime: '3 min read',
      trending: true,
    },
    {
      id: '2',
      title: 'Federal Reserve Signals Potential Rate Cut in December Meeting',
      summary: 'The Federal Reserve indicated it may consider cutting interest rates at its next meeting, citing economic uncertainty.',
      source: 'Bloomberg',
      timeAgo: '4 hours ago',
      category: 'economy',
      image: 'https://via.placeholder.com/300x200',
      readTime: '5 min read',
      trending: false,
    },
    {
      id: '3',
      title: 'Tesla Stock Surges 8% on Strong Delivery Numbers',
      summary: 'Tesla shares jumped after the company reported better-than-expected vehicle deliveries for the third quarter.',
      source: 'CNBC',
      timeAgo: '6 hours ago',
      category: 'market',
      image: 'https://via.placeholder.com/300x200',
      readTime: '2 min read',
      trending: true,
    },
    {
      id: '4',
      title: 'NVIDIA Announces New AI Chip Architecture',
      summary: 'NVIDIA unveiled its latest AI chip architecture, promising significant performance improvements for machine learning workloads.',
      source: 'TechCrunch',
      timeAgo: '8 hours ago',
      category: 'sector',
      image: 'https://via.placeholder.com/300x200',
      readTime: '4 min read',
      trending: false,
    },
  ];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? 0 : 280,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const renderNewsItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.newsCard, { backgroundColor: colors.card }]}>
      <View style={styles.newsImageContainer}>
        <Image source={{ uri: item.image }} style={styles.newsImage} />
        {item.trending && (
          <View style={styles.trendingBadge}>
            <Ionicons name="trending-up" size={12} color="white" />
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        )}
      </View>
      
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.newsSummary, { color: colors.tabIconDefault }]} numberOfLines={3}>
          {item.summary}
        </Text>
        
        <View style={styles.newsMeta}>
          <View style={styles.metaLeft}>
            <Text style={[styles.source, { color: colors.tint }]}>{item.source}</Text>
            <Text style={[styles.timeAgo, { color: colors.tabIconDefault }]}>{item.timeAgo}</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={[styles.readTime, { color: colors.tabIconDefault }]}>{item.readTime}</Text>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={16} color={colors.tabIconDefault} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTrendingNews = () => (
    <View style={styles.trendingSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
        {mockNews.filter(news => news.trending).map((item) => (
          <TouchableOpacity key={item.id} style={[styles.trendingCard, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.image }} style={styles.trendingImage} />
            <View style={styles.trendingContent}>
              <Text style={[styles.trendingTitle, { color: colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.trendingSource, { color: colors.tint }]}>{item.source}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    const filteredNews = activeTab === 'all' 
      ? mockNews 
      : mockNews.filter(news => news.category === activeTab);

    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'all' && renderTrendingNews()}
        
        <View style={styles.newsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {sidebarItems.find(item => item.id === activeTab)?.title}
            </Text>
          </View>
          
          <FlatList
            data={filteredNews}
            renderItem={renderNewsItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.newsList}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <CustomHeader 
        title={sidebarItems.find(item => item.id === activeTab)?.title || 'News'} 
        onMenuPress={toggleSidebar}
        leftComponent={
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color={colors.tint} />
          </TouchableOpacity>
        }
      />
      
      {renderContent()}

      <Sidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isVisible={sidebarVisible}
        onClose={closeSidebar}
        slideAnim={slideAnim}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  filterButton: {
    padding: 4,
  },
  trendingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trendingScroll: {
    marginBottom: 8,
  },
  trendingCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendingImage: {
    width: '100%',
    height: 120,
  },
  trendingContent: {
    padding: 12,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  trendingSource: {
    fontSize: 12,
    fontWeight: '500',
  },
  newsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newsList: {
    paddingBottom: 20,
  },
  newsCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  newsImageContainer: {
    position: 'relative',
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  trendingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  bookmarkButton: {
    padding: 4,
  },
  newsSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  timeAgo: {
    fontSize: 12,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    marginRight: 8,
  },
  shareButton: {
    padding: 4,
  },
});
