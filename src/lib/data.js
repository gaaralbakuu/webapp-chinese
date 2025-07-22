
import hsk1 from './hsk/hsk1.js';
import hsk2 from './hsk/hsk2.js';
import hsk3 from './hsk/hsk3.js';
import hsk4 from './hsk/hsk4.js';
import hsk5 from './hsk/hsk5.js';

// HSK Vocabulary Data organized by levels
export const hskVocabularyData = {
  HSK1: hsk1,
  HSK2: hsk2,
  HSK3: hsk3,
  HSK4: hsk4,
  HSK5: hsk5,
};

// Flatten all HSK data for backward compatibility
export const vocabularyData = Object.values(hskVocabularyData).flat();

// HSK Levels configuration
export const hskLevels = [
  { id: "HSK1", name: "HSK 1", description: "Cơ bản nhất", color: "green", wordCount: 60 },
  { id: "HSK2", name: "HSK 2", description: "Cơ bản", color: "blue", wordCount: 60 },
  { id: "HSK3", name: "HSK 3", description: "Trung cấp", color: "orange", wordCount: 22 },
  { id: "HSK4", name: "HSK 4", description: "Trung cấp cao", color: "purple", wordCount: 20 },
  { id: "HSK5", name: "HSK 5", description: "Nâng cao", color: "red", wordCount: 20 }
];

// Topics data updated with HSK levels
export const topicsData = [
  {
    id: "greetings",
    name: "Chào hỏi",
    description: "Các câu chào hỏi cơ bản",
    icon: "👋",
    wordCount: 2,
    color: "blue",
    hskLevels: ["HSK1"]
  },
  {
    id: "pronouns",
    name: "Đại từ",
    description: "Các đại từ cơ bản",
    icon: "👤",
    wordCount: 8,
    color: "yellow",
    hskLevels: ["HSK1"]
  },
  {
    id: "grammar",
    name: "Ngữ pháp",
    description: "Từ ngữ pháp cơ bản",
    icon: "📝",
    wordCount: 5,
    color: "gray",
    hskLevels: ["HSK1"]
  },
  {
    id: "questions",
    name: "Câu hỏi",
    description: "Từ để hỏi",
    icon: "❓",
    wordCount: 2,
    color: "indigo",
    hskLevels: ["HSK1"]
  },
  {
    id: "demonstratives",
    name: "Từ chỉ định",
    description: "Này, kia, đó",
    icon: "👆",
    wordCount: 2,
    color: "pink",
    hskLevels: ["HSK1"]
  },
  {
    id: "food",
    name: "Thức ăn",
    description: "Từ vựng về đồ ăn uống",
    icon: "🍽️",
    wordCount: 4,
    color: "orange",
    hskLevels: ["HSK1"]
  },
  {
    id: "numbers",
    name: "Số đếm",
    description: "Các số cơ bản",
    icon: "🔢",
    wordCount: 13,
    color: "green",
    hskLevels: ["HSK1"]
  },
  {
    id: "countries",
    name: "Quốc gia",
    description: "Tên các nước",
    icon: "🌍",
    wordCount: 1,
    color: "red",
    hskLevels: ["HSK1"]
  },
  {
    id: "people",
    name: "Con người",
    description: "Từ vựng về con người",
    icon: "👥",
    wordCount: 5,
    color: "purple",
    hskLevels: ["HSK1"]
  },
  {
    id: "verbs",
    name: "Động từ",
    description: "Các động từ cơ bản",
    icon: "🏃",
    wordCount: 9,
    color: "cyan",
    hskLevels: ["HSK1"]
  },
  {
    id: "places",
    name: "Địa điểm",
    description: "Các địa điểm cơ bản",
    icon: "📍",
    wordCount: 2,
    color: "teal",
    hskLevels: ["HSK1"]
  },
  {
    id: "basic_info",
    name: "Thông tin cơ bản",
    description: "Thông tin cá nhân cơ bản",
    icon: "ℹ️",
    wordCount: 1,
    color: "indigo",
    hskLevels: ["HSK1"]
  },
  {
    id: "adjectives",
    name: "Tính từ",
    description: "Các tính từ cơ bản",
    icon: "✨",
    wordCount: 5,
    color: "pink",
    hskLevels: ["HSK1", "HSK2"]
  },
  {
    id: "adverbs",
    name: "Trạng từ",
    description: "Các trạng từ cơ bản",
    icon: "🎯",
    wordCount: 3,
    color: "orange",
    hskLevels: ["HSK1"]
  },
  {
    id: "prepositions",
    name: "Giới từ",
    description: "Các giới từ cơ bản",
    icon: "🔗",
    wordCount: 6,
    color: "blue",
    hskLevels: ["HSK1", "HSK2"]
  },
  {
    id: "family",
    name: "Gia đình",
    description: "Từ vựng về thành viên gia đình",
    icon: "👨‍👩‍👧‍👦",
    wordCount: 3,
    color: "green",
    hskLevels: ["HSK2"]
  },
  {
    id: "education",
    name: "Giáo dục",
    description: "Từ vựng về học tập",
    icon: "📚",
    wordCount: 3,
    color: "blue",
    hskLevels: ["HSK2"]
  },
  {
    id: "work",
    name: "Công việc",
    description: "Từ vựng về nghề nghiệp",
    icon: "💼",
    wordCount: 2,
    color: "purple",
    hskLevels: ["HSK2", "HSK4", "HSK5"]
  },
  {
    id: "time",
    name: "Thời gian",
    description: "Từ vựng về thời gian",
    icon: "⏰",
    wordCount: 10,
    color: "orange",
    hskLevels: ["HSK2"]
  },
  {
    id: "shopping",
    name: "Mua sắm",
    description: "Từ vựng về mua bán",
    icon: "🛒",
    wordCount: 5,
    color: "yellow",
    hskLevels: ["HSK2"]
  },
  {
    id: "home",
    name: "Nhà ở",
    description: "Từ vựng về nhà cửa",
    icon: "🏠",
    wordCount: 1,
    color: "brown",
    hskLevels: ["HSK2"]
  },
  {
    id: "directions",
    name: "Hướng",
    description: "Từ vựng về phương hướng",
    icon: "🧭",
    wordCount: 6,
    color: "purple",
    hskLevels: ["HSK2"]
  },
  {
    id: "weather",
    name: "Thời tiết",
    description: "Từ vựng về thời tiết",
    icon: "🌤️",
    wordCount: 2,
    color: "lightblue",
    hskLevels: ["HSK2", "HSK3"]
  },
  {
    id: "emotions",
    name: "Cảm xúc",
    description: "Từ vựng về cảm xúc",
    icon: "😊",
    wordCount: 4,
    color: "pink",
    hskLevels: ["HSK2"]
  },
  {
    id: "travel",
    name: "Du lịch",
    description: "Từ vựng liên quan đến du lịch",
    icon: "✈️",
    wordCount: 5,
    color: "cyan",
    hskLevels: ["HSK3"]
  },
  {
    id: "sports",
    name: "Thể thao",
    description: "Các môn thể thao",
    icon: "⚽",
    wordCount: 4,
    color: "green",
    hskLevels: ["HSK3"]
  },
  {
    id: "entertainment",
    name: "Giải trí",
    description: "Hoạt động giải trí",
    icon: "🎭",
    wordCount: 4,
    color: "purple",
    hskLevels: ["HSK3"]
  },
  {
    id: "technology",
    name: "Công nghệ",
    description: "Từ vựng về công nghệ",
    icon: "💻",
    wordCount: 3,
    color: "blue",
    hskLevels: ["HSK3", "HSK4"]
  },
  {
    id: "health",
    name: "Sức khỏe",
    description: "Từ vựng về sức khỏe",
    icon: "🏥",
    wordCount: 1,
    color: "red",
    hskLevels: ["HSK3"]
  },
  {
    id: "abstract",
    name: "Trừu tượng",
    description: "Các khái niệm trừu tượng",
    icon: "💭",
    wordCount: 15,
    color: "gray",
    hskLevels: ["HSK4", "HSK5"]
  },
  {
    id: "politics",
    name: "Chính trị",
    description: "Từ vựng về chính trị, pháp luật",
    icon: "🏛️",
    wordCount: 4,
    color: "darkblue",
    hskLevels: ["HSK4", "HSK5"]
  },
  {
    id: "science",
    name: "Khoa học",
    description: "Từ vựng về khoa học công nghệ",
    icon: "🔬",
    wordCount: 2,
    color: "green",
    hskLevels: ["HSK4"]
  },
  {
    id: "environment",
    name: "Môi trường",
    description: "Từ vựng về môi trường, tự nhiên",
    icon: "🌱",
    wordCount: 2,
    color: "green",
    hskLevels: ["HSK4"]
  },
  {
    id: "business",
    name: "Kinh doanh",
    description: "Từ vựng về kinh tế, kinh doanh",
    icon: "💰",
    wordCount: 6,
    color: "gold",
    hskLevels: ["HSK5"]
  }
];

// Get vocabulary by HSK level
export function getVocabularyByHSK(hskLevel) {
  return hskVocabularyData[hskLevel] || [];
}

// Get vocabulary by topic
export function getVocabularyByTopic(topicId) {
  return vocabularyData.filter(word => word.topic === topicId);
}

// Get vocabulary by topic and HSK level
export function getVocabularyByTopicAndHSK(topicId, hskLevel) {
  return vocabularyData.filter(word => word.topic === topicId && word.hskLevel === hskLevel);
}

// Get random vocabulary for quiz
export function getRandomVocabulary(count = 10, hskLevel = null) {
  let data = hskLevel ? getVocabularyByHSK(hskLevel) : vocabularyData;
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get topics by HSK level
export function getTopicsByHSK(hskLevel) {
  return topicsData.filter(topic => topic.hskLevels.includes(hskLevel));
}

// Get words by topic
export function getWordsByTopic(topicId) {
  return vocabularyData.filter(word => word.topic === topicId);
}
