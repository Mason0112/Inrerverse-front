<template>
    <div class="container">
        <!-- <Vueform>
            <TextElement name="email" placeholder="Email" rules="exists:users|required|email" />
        </Vueform> -->

        <Vueform size="md" :display-errors="false" ref="form$">
            <StaticElement name="register_title" content="註冊" tag="h1" />
            <StaticElement name="divider" tag="hr" />
            <!-- <GroupElement name="container" description="Make sure it matches your legal name">
                <TextElement name="first_name" placeholder="First name" :columns="{
                    container: 6,
                    label: 12,
                    wrapper: 12,
                }" field-name="First name" :rules="[
            'required',
            'max:255',
        ]" />
                <TextElement name="last_name" placeholder="Last name" :columns="{
                    container: 6,
                    label: 12,
                    wrapper: 12,
                }" field-name="Last name" :rules="[
            'required',
            'max:255',
        ]" />
            </GroupElement> -->

            <TextElement name="accountNumber" placeholder="請輸入帳號" rules="required" />

            <TextElement name="password" input-type="password" :rules="[
                'required',
                'min:8',
                'same:password_confirmation',
            ]" field-name="Password" placeholder="請輸入密碼" />
            <TextElement name="password_confirmation" input-type="password" :rules="[
                'required',
            ]" field-name="Password confirmation" placeholder="再次輸入密碼" />

            <TextElement name="email" input-type="email" :rules="[
                'required',
                'max:255',
                'email',
            ]" placeholder="請輸入Email" field-name="Email"
                description="You will receive a confirmation letter to this email." />

            <TextElement name="nickname" placeholder="請輸入暱稱" rules="required" />

            <PhoneElement name="phoneNumber" placeholder="Phone" :rules="[
                'required',
            ]" field-name="Phone" :allow-incomplete="true" :unmask="true" />

            <SelectElement name="country1" :search="true" :native="false" input-type="search" autocomplete="disabled"
                placeholder="國籍" items="/json/countries.json" />
            <!-- <SelectElement name="state" :search="true" :native="false" input-type="search" autocomplete="disabled"
                placeholder="State" items="/json/states.json" :conditions="[
                    [
                        'country',
                        'in',
                        [
                            'US',
                        ],
                    ],
                ]" /> -->
            <TextElement name="country" placeholder="請輸入國籍" rules="required" />
            <TextElement name="city" placeholder="請輸入居住城市" rules="required" />
            <DateElement name="birthday" placeholder="生日" field-name="生日" :rules="[
                'required', 'before:today'
            ]" display-format="YYYY-MM-DD" />

            <!-- <RadiogroupElement name="gender" :items="[
                '男',
                '女',
                '其他',
                '不透露',
            ]" label="性別" :rules="[
                'required',
            ]" /> -->
            <TextElement name="gender" placeholder="性別" rules="required" />
            <TextElement name="photo" placeholder="照片" />
            <TextElement name="bio" placeholder="自介" />


            <CheckboxElement name="terms" text="I accept the Terms & Conditions & Privacy Policy" rules="accepted"/>
            <StaticElement name="divider_1" tag="hr" />
            <ButtonElement name="register" button-label="註冊" :full="true" size="lg" @click="register" :submits="true"/>
        </Vueform>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios';
import  { useRouter } from 'vue-router';

const form$ = ref(null);
const router = useRouter();

function register() {

    let request={
                accountNumber: accountNumber.value,
                password: password.value,
                email: email.value,
                nickname: nickname.value,
                phoneNumber: phoneNumber.value,
                country: country.value,
                city: city.value,
                birthday: birthday.value,
                gender: gender.value,
                photo: photo.value,
        }
    
    console.log(request);
    axios.post("/user/register", request)
    .then(function(response){
        console.log("response", response);

        if (response.data.success){
            router.push("/user/login");
        }
    })
    .catch(function(error){
        console.log("error", error);
    })
}

</script>

<style></style>