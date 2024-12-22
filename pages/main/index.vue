<template>
  <div class="flex flex-col gap-2 p-6 bg-gray-800 rounded-lg shadow-lg max-w-xl mx-auto">
    <button class="bg-gray-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" @click="skipQuestion">Skip question</button>
    <p class="text-xl font-semibold text-gray-200">
      {{ question }}
    </p>
    <textarea
      name="answer"
      id="answer-textarea"
      v-model="answer"
      class="w-full p-4 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
      :class="{
        'border-green-600': isCorrect === true,
        'bg-green-900': isCorrect === true,
        'border-red-600': isCorrect === false,
        'bg-red-950': isCorrect === false,
      }"
      rows="6"
      placeholder="Введите ваш ответ..."
    ></textarea>
    <button @click="checkAnswer" class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">Send answer</button>
    <p class="text-white">{{ description }}</p>
  </div>
</template>

<script lang="ts" setup>
const questions = ref(null)
const question = ref(null)
const answer = ref(null)
const isCorrect = ref(null)
const description = ref(null)

const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.value.length);
  return questions.value[randomIndex].question;
}

const skipQuestion = () => {
  question.value = getRandomQuestion();
  isCorrect.value = null;
  description.value = null;
  answer.value = null;
}

const fetchOpenAIResponse = async (messages: OpenAIMessage[]) => {
  const response = await $fetch('/api/openai', {
    method: 'POST',
    body: {
      messages,
    },
  });

  return response.body
}

const checkAnswer = async () => {
  const propt = `"Вопрос: ${question.value}? Ответ студента: ${answer.value}. Пожалуйста, оцените ответ. Верно ли он? Ответьте в формате JSON, который включает два поля: 'isCorrect' (true/false) и 'description' (краткое пояснение). Если ответ верен, установите 'isCorrect' в true. Если ответ неверен, установите 'isCorrect' в false и поясните, где была допущена ошибка или что нужно дополнить. Убедитесь, что JSON корректен и не добавляйте лишние символы или обертки. Пример ответа: {\"isAnswerCorrect\": true, \"description\": \"Правильный ответ.\"}"`

  const response = await fetchOpenAIResponse([{role: 'user', content: propt}])
  const attempt = await JSON.parse(response)

  isCorrect.value = attempt.isCorrect
  description.value = attempt.description
}

onMounted(async () => {
  const response = await import('~/mocks/questions.json');
  questions.value = response.default.questions;
  question.value = getRandomQuestion();
});
</script>

<style scoped>

</style>