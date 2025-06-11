import axios from "axios"

const BASE_URL = 'https://thaipham.pythonanywhere.com/'

export const endpoints = {
    //Authentication
    register: '/users/',
    login: '/o/token/',
    loginGoogleFit: '/login/google-fit/',

    //Diets & Menus
    diets: '/diets/',
    dietMenu: (dietId) => `/diets/${dietId}/menu/`,
    menuOfDay: (menuId) => `/menus/${menuId}/menu-of-day/`,

    menus: '/menus/',

    // Meals & Ingredients
    meals: '/meals/',
    ingredients: '/ingredient/',
    ingredientInMenu: '/menu-ingredients/',

    //User
    users: '/users/',
    currentUser: '/users/current-user/',
    currentUserMenu: '/users/current-user/menu/',
    userIngredients: '/user-ingredient/',
    userSchedules: '/user-schedule/',
    userScheduleById: (id) => `/user-schedule/${id}/`,
    userScheduleActive: '/user-schedule/schedule-active/',

    //personal
    personaUserlSchedules: '/personal-user-schedule/',
    personaUserlScheduleById: (id) => `/personal-user-schedule/${id}/`,
    personalScheduleActive: '/personal-user-schedule/schedule-active/',

    //tags
    tags: '/tags/',

    //Schedule
    groupSchedules: '/group-schedules/',
    scheduleDetail: (id) => `/schedules/${id}/`,
    groupScheduleItems: (groupId) => `/group-schedules/${groupId}/schedules/`,
    personalSchedules: '/personal-schedules/',
    personalScheduleById: (id) => `/personal-schedules/${id}/`,

    //Sessions
    sessionsInSchedule: (scheduleId) => `/schedules/${scheduleId}/session/`,
    personalSessions: (personalScheduleId) => `/personal-schedules/${personalScheduleId}/session/`,
    sessionList: '/sessions/',
    sessionDetail: (id) => `/sessions/${id}/`,
    resultSession: '/result-session/',
    resultSessionDetail: (id) => `/result-session/${id}/`,

    //Exercise
    exercises: '/exercises/',
    exercisesDetail: (id) => `/exercises/${id}/`,
    predictedResult: '/predicted-result/',
    actualResult: (exerciseId, scheduleId) =>
        `/actual-result/?exercise_id=${exerciseId}&schedule_id=${scheduleId}`,
    //Instruct
    instructInExercise: (id) => `/exercises/${id}/instruct`,

    //Reminder
    reminders: '/reminders/',

    //Health
    healthInfo: '/health-info/',
    healthGoals: '/health-goals/',
    healthDiary: '/health-diarys/',
    updateHealthInfo: (id) => `/health-info/${id}/`,
    healthFromGoogleFit: (token) => `/users/current-user/health-data/?access_token=${token}`,

    //Statistics
    practiceStats: '/stats/practice/',
    healthProgressStats: '/stats/health-progress/',
    totalNutrients: '/stats/get_total_nutrients/',
    nutrientIntake: '/stats/get_nutrients_intake/',
    sessionCompleteStats: '/stats/get_session_complete/',
    exerciseCompleteStats: '/stats/get_exercise_complete/',
    expectedSessionResult: '/stats/get_expected_result_session/',
    actualSessionResult: '/stats/get_actual_result_session/',

    //Experts
    experts: '/experts/',
    expertDetail: '/experts/expert/',

    //Customers
    customers: '/customers/',


}

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}


export default axios.create({
    baseURL: BASE_URL
});