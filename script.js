/* =========================================================
   MVP 둥지 script.js (예시 페이지, 11/3)
   섹션 3 체험용 예시: 피드백을 남기면 모이가 쌓이고 등급이 오른다
   - 담당: 노화성 (섹션 3)
   - HTML에서 JS가 쓰는 요소는 id로 찾습니다. (CSS는 class를 씁니다)
     그래서 디자인 담당이 class 이름을 바꿔도 JS는 깨지지 않습니다.
   - 체험용이라 저장하지 않습니다. 새로고침하면 처음(알, 모이 0)으로 돌아갑니다.
   ========================================================= */


// 1. 화면에서 쓸 요소를 id로 찾아 둔다
const feedbackInput = document.querySelector('#feedbackInput');
const feedbackButton = document.querySelector('#feedbackButton');
const feedbackMessage = document.querySelector('#feedbackMessage');
const feedbackList = document.querySelector('#feedbackList');
const resetButton = document.querySelector('#resetButton');

const gradeIcon = document.querySelector('#gradeIcon');
const gradeName = document.querySelector('#gradeName');
const pointValue = document.querySelector('#pointValue');
const progressBar = document.querySelector('#progressBar');
const nextGrade = document.querySelector('#nextGrade');


// 2. 등급표: 모이가 min 이상이면 그 등급 (낮은 등급부터 순서대로)
const grades = [
  { name: '알', icon: '🥚', min: 0 },
  { name: '아기새', icon: '🐣', min: 30 },
  { name: '어른새', icon: '🐦', min: 60 },
];

const POINT_PER_FEEDBACK = 10; // 피드백 한 번에 받는 모이


// 3. 지금 상태: 모은 모이
let points = 0;


// 4. 모이에 맞는 등급의 번호(grades 배열의 위치)를 찾는다
//    높은 등급부터 확인해서, 처음 조건에 맞는 등급을 돌려준다
function getGradeIndex(currentPoints) {
  for (let i = grades.length - 1; i >= 0; i--) {
    if (currentPoints >= grades[i].min) {
      return i;
    }
  }
  return 0;
}


// 5. 지금 모이에 맞게 등급·모이·막대·안내 문구를 다시 그린다
function render() {
  const gradeIndex = getGradeIndex(points);
  const grade = grades[gradeIndex];
  const next = grades[gradeIndex + 1]; // 다음 등급 (가장 높은 등급이면 undefined)

  gradeIcon.textContent = grade.icon;
  gradeName.textContent = grade.name;
  pointValue.textContent = points;

  if (next) {
    // 이번 등급 안에서 다음 등급까지 얼마나 왔는지 (0~100)
    const percent = ((points - grade.min) / (next.min - grade.min)) * 100;
    progressBar.style.width = percent + '%';
    nextGrade.textContent = `${next.name}까지 모이 ${next.min - points} 남았어요`;
  } else {
    progressBar.style.width = '100%';
    nextGrade.textContent = '가장 높은 등급이에요! 이제 다른 둥지를 도와줄 차례예요.';
  }
}


// 6. [피드백 남기기] 버튼을 눌렀을 때
feedbackButton.addEventListener('click', function () {
  const text = feedbackInput.value.trim(); // 앞뒤 빈칸을 뺀 글

  // 빈칸이면 안내만 하고 끝낸다
  if (text === '') {
    feedbackMessage.textContent = '피드백 칸이 비어 있어요. 한 줄이라도 적어 주세요.';
    feedbackInput.focus();
    return;
  }

  const beforeIndex = getGradeIndex(points);
  points = points + POINT_PER_FEEDBACK;
  const afterIndex = getGradeIndex(points);

  // 남긴 피드백을 목록 맨 위에 붙인다
  // (textContent를 쓰면 입력한 글이 HTML로 해석되지 않아 안전하다)
  const item = document.createElement('li');
  item.textContent = text;
  feedbackList.prepend(item);

  // 등급이 올랐는지에 따라 다른 안내
  if (afterIndex > beforeIndex) {
    feedbackMessage.textContent = `${grades[afterIndex].name}로 자랐어요! 모이 +${POINT_PER_FEEDBACK}`;
  } else {
    feedbackMessage.textContent = `피드백을 남겼어요. 모이 +${POINT_PER_FEEDBACK}`;
  }

  feedbackInput.value = ''; // 입력 칸 비우기
  render();
});


// 7. [처음부터 다시] 버튼을 눌렀을 때
resetButton.addEventListener('click', function () {
  points = 0;
  feedbackList.innerHTML = '';
  feedbackMessage.textContent = '';
  feedbackInput.value = '';
  render();
});


// 8. 페이지를 처음 열었을 때 한 번 그린다
render();