<template>
    <div class="container update-form">

        <h6 class="section-title">編輯個人資料</h6>
        <Vueform size="md" :display-errors="false" ref="form$" :endpoint="false">
            <TextElement name="email" input-type="email" :rules="[
                'required',
                'max:255',
                'email',
            ]" field-name="Email" label="Email" :default="email"/>

            <TextElement name="nickname" rules="required" label="暱稱" :default="nickname"/>

            <PhoneElement name="phoneNumber" :rules="[
                'required',
            ]" field-name="電話號碼" :allow-incomplete="true" :unmask="false" label="電話號碼" :default="phoneNumber" />
            <SelectElement name="country1" :search="true" :native="false" input-type="search" autocomplete="disabled"
                placeholder="國籍" items="/json/countries.json" :columns="{
                    container: 6,
                    label: 12,
                    wrapper: 12,
                }" />
            <TextElement name="country" rules="required" label="國籍" :default="country" :columns="{
                container: 6,
                label: 12,
                wrapper: 12,
            }" />
            <TextElement name="city" label="居住城市" rules="required" :default="city" :columns="{
                container: 6,
                label: 12,
                wrapper: 12,
            }" />
            <DateElement name="birthday" label="生日" field-name="生日" :default="birthday" :rules="[
                'required', 'before:today'
            ]" display-format="YYYY-MM-DD" />
            <TextElement name="gender" label="性別" :default="gender" rules="required" />
            <TextareaElement name="bio" label="自介" :default="bio"/>
            <ButtonElement name="cancel" button-label="取消" size="lg" @click="cancelUpdate"/>
            <ButtonElement name="register" button-label="更新" size="lg":submits="true" @click="updateProfile"/>
        </Vueform>

    </div>
</template>
    
<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";

const form$ = ref(null);

const userStore = useUserStore();
const userId = userStore.userId;

const props = defineProps({
  email: String,
  nickname: String,
  phoneNumber: String,
  country: String,
  city: String,
  birthday: String,
  gender: String,
  bio: String,
});

const emit = defineEmits(['update-success']);

function updateProfile() {
    let request = {
        email: email.value,
        nickname: nickname.value,
        phoneNumber: phoneNumber.value,
        country: country.value,
        city: city.value,
        birthday: birthday.value,
        gender: gender.value,
        bio: bio.value
    }

    console.log(request);
    axios.put(`/user/secure/${userId}`, request)
        .then(function (response) {
            console.log("response", response);

            if (response.data.success) {
                //成功的邏輯
                emit('update-success');
            }
        })
        .catch(function (error) {
            console.log("error", error);
        })
}

function cancelUpdate() {
    //TODO
}

</script>

<style scope>
.update-form {
    width: 75%;
}
</style>