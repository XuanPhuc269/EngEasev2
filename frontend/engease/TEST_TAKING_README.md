# Test Taking & Results Components

Phần components để làm bài thi và xem kết quả đã được implement đầy đủ.

## Test Taking Components (`/components/test-taking`)

### 1. **TestTimer**
- Countdown timer với hiển thị thời gian còn lại
- Warning khi còn < 5 phút (màu vàng)
- Critical alert khi còn < 1 phút (màu đỏ, pulse animation)
- Auto-submit khi hết giờ
- Sticky position để luôn hiển thị

### 2. **TestProgress**
- Progress bar hiển thị tiến độ làm bài
- Hiển thị số câu hiện tại / tổng số câu
- Hiển thị số câu đã trả lời / tổng số câu

### 3. **QuestionNavigation**
- Grid các số câu hỏi để navigate nhanh
- Visual indicators:
  - Primary (contained): Câu hiện tại
  - Success (outlined): Câu đã trả lời
  - Default (outlined): Câu chưa trả lời
  - Warning flag icon: Câu đã đánh dấu
- Stats summary (đã trả lời, chưa trả lời, đã đánh dấu)
- Buttons Previous/Next

### 4. **SubmitTestDialog**
- Confirmation dialog trước khi nộp bài
- Hiển thị số câu đã/chưa trả lời
- Warning nếu còn câu chưa trả lời
- Loading state khi đang submit

## Test Taking Page

### `/app/tests/[id]/take/page.tsx`
Main page để làm bài thi với:
- Test info header
- Timer (sticky sidebar)
- Progress bar
- Question display với QuestionCard
- Flag/unflag questions
- Navigation between questions
- Submit dialog
- Auto-submit when time expires
- Prevent navigation away (beforeunload)
- Redirect to results after submit

### API Integration
- `useGetTestByIdQuery`: Lấy thông tin test
- `useGetQuestionsByTestIdQuery`: Lấy danh sách câu hỏi
- `useSubmitTestMutation`: Submit bài thi

## Result Components (`/components/result`)

### 1. **ResultCard**
- Card hiển thị một kết quả test
- Thông tin: test title, date, time spent
- Score với progress bar và color coding
- Pass/fail status
- Correct answers count
- Click để xem chi tiết

### 2. **ResultList**
- List các ResultCard
- Sử dụng trong ResultsPage

### 3. **ResultStats**
- Summary statistics:
  - Tổng bài thi
  - Số bài đạt yêu cầu
  - Điểm trung bình
- Reusable component

## Result Pages

### `/app/results/page.tsx`
Danh sách tất cả kết quả bài thi:
- ResultStats summary
- ResultList với pagination
- Empty state

### `/app/results/[id]/page.tsx`
Chi tiết một kết quả bài thi:
- Score overview với circular progress
- Pass/fail status
- Stats (correct answers, time spent, date)
- Questions review với accordion
  - Hiển thị user answer
  - Hiển thị correct answer
  - Hiển thị explanation
  - Visual feedback (correct/incorrect)
- Button "Làm lại"

### API Integration
- `useGetTestResultQuery`: Lấy chi tiết kết quả
- `useGetUserTestResultsQuery`: Lấy danh sách kết quả của user

## Routes Structure

```
/tests/[id]/take        → TakeTestPage (làm bài thi)
/results                → ResultsPage (danh sách kết quả)
/results/[id]           → ResultDetailPage (chi tiết kết quả)
```

## Features Implemented

✅ Test taking với timer
✅ Question navigation
✅ Flag questions
✅ Auto-submit khi hết giờ
✅ Prevent accidental navigation
✅ Submit confirmation dialog
✅ Result viewing với scores
✅ Question review với explanations
✅ Result statistics
✅ Pagination cho results
✅ Responsive design
✅ TypeScript với full type safety
✅ Redux integration
✅ Material-UI components
✅ AuthGuard protection

## Usage Example

### Taking a test:
1. Navigate to `/tests`
2. Click "Làm bài thi" on a test
3. Answer questions with timer countdown
4. Use navigation grid to jump between questions
5. Flag questions for review
6. Click "Nộp bài" when done
7. Confirm in dialog
8. Auto-redirect to result detail

### Viewing results:
1. Navigate to `/results`
2. See all completed tests with scores
3. Click on a result to view details
4. Review all questions with explanations
5. Click "Làm lại" to retake

## Next Steps
- ProgressPage implementation (tracking learning progress)
- Dashboard components (admin/teacher views)
- Grade manual questions (essay type)
- Export results to PDF
- Email notifications
