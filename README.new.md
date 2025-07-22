# 🇨🇳 Chinese Vocabulary Learning App

Ứng dụng học từ vựng tiếng Trung với Next.js, được thiết kế theo phong cách tối giản và tập trung vào trải nghiệm người dùng.

## ✨ Tính năng

### ✅ Đã hoàn thành
- 🏠 **Trang chủ** - Giới thiệu ứng dụng và thống kê học tập
- 📚 **Học từ vựng** - Flashcard tương tác với phát âm
- 🧠 **Kiểm tra** - Quiz trắc nghiệm và nghe đoán từ
- 📖 **Kho từ vựng** - Xem và quản lý từ đã học
- 🏷️ **Chủ đề** - Học theo các chủ đề cụ thể
- ❤️ **Yêu thích** - Lưu và ôn tập từ yêu thích
- 🎨 **UI tối giản** - Thiết kế theo Material Design principles
- 📱 **Responsive** - Tối ưu cho mobile và desktop
- 🔊 **Phát âm** - Tích hợp Web Speech API

### 🎯 Navigation
- Header với logo và menu điều hướng
- Mobile-friendly navigation
- Active state highlighting

### 📊 Data Management
- Context API cho state management
- LocalStorage để lưu trữ progress
- Sample vocabulary data (8 từ với 4 chủ đề)

## 🚀 Cài đặt và Chạy

```bash
# Clone repository
git clone [repository-url]

# Di chuyển vào thư mục dự án
cd webapp-chinese

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Mở trình duyệt và truy cập
http://localhost:3000
```

## 🏗️ Cấu trúc dự án

```
src/
├── app/
│   ├── components/
│   │   └── Navigation.jsx
│   ├── learn/
│   │   └── page.jsx
│   ├── quiz/
│   │   └── page.jsx
│   ├── vocab/
│   │   └── page.jsx
│   ├── topics/
│   │   ├── page.jsx
│   │   └── [id]/
│   │       └── page.jsx
│   ├── favorites/
│   │   └── page.jsx
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
└── lib/
    ├── data.js
    ├── AppContext.js
    └── utils.js
```

## 🎨 Design System

Ứng dụng tuân theo các nguyên tắc thiết kế tối giản:

- **Font**: Inter (font-sans)
- **Colors**: Neutral grays với blue accent
- **Spacing**: Consistent với Tailwind spacing scale
- **Components**: Rounded corners (rounded-xl), subtle shadows
- **No**: Gradients, thick borders, distracting animations

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized cho tablets và mobile devices

## 🔊 Audio Features

- Web Speech API cho phát âm tiếng Trung
- Fallback cho browsers không hỗ trợ
- Chinese language setting (zh-CN)

## 📈 Progress Tracking

- Từ đã học
- Từ yêu thích
- Quiz statistics
- Study streaks (planned)

## 🌟 Next Steps

### Planned Features
- User profiles
- Advanced quiz modes
- Audio files cho từ vựng
- Offline support (PWA)
- Spaced repetition algorithm
- More vocabulary topics
- Settings page

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: LocalStorage
- **Audio**: Web Speech API

## 📝 License

MIT License - xem file LICENSE để biết thêm chi tiết.
