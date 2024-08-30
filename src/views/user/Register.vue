<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 col-xl-9 mx-auto">
        <div
          class="card flex-row my-5 border-0 shadow rounded-3 overflow-hidden"
        >
          <div class="card-img-left d-none d-md-flex">
            <!-- Background image for card set in CSS! -->
          </div>
          <div class="card-body p-4 p-sm-5">
            <Vueform
              size="md"
              :display-errors="false"
              ref="form$"
              :endpoint="false"
            >
              <StaticElement name="register_title" content="註冊" tag="h1" />
              <StaticElement name="divider" tag="hr" />

              <TextElement
                name="accountNumber"
                placeholder="請輸入帳號"
                rules="required"
              />
              <!-- :messages="{}" -->

              <TextElement
                name="password"
                input-type="password"
                :rules="['required', 'min:8', 'same:password_confirmation']"
                field-name="Password"
                placeholder="請輸入密碼"
              />
              <TextElement
                name="password_confirmation"
                input-type="password"
                :rules="['required']"
                field-name="Password confirmation"
                placeholder="再次輸入密碼"
              />

              <TextElement
                name="email"
                input-type="email"
                :rules="['required', 'max:255', 'email']"
                placeholder="請輸入Email"
                field-name="Email"
                description="You will receive a confirmation letter to this email."
              />

              <TextElement
                name="nickname"
                placeholder="請輸入暱稱"
                rules="required"
              />

              <PhoneElement
                name="phoneNumber"
                placeholder="請輸入電話號碼"
                :rules="['required']"
                field-name="電話號碼"
                :allow-incomplete="true"
                :unmask="true"
              />

              <SelectElement
                name="country1"
                :search="true"
                :native="false"
                input-type="search"
                autocomplete="disabled"
                placeholder="國籍"
                items="/json/countries.json"
                :columns="{
                  container: 6,
                  label: 12,
                  wrapper: 12,
                }"
              />

              <TextElement
                name="country"
                placeholder="請輸入國籍"
                rules="required"
                :columns="{
                  container: 6,
                  label: 12,
                  wrapper: 12,
                }"
              />
              <TextElement
                name="city"
                placeholder="請輸入居住城市"
                rules="required"
                :columns="{
                  container: 6,
                  label: 12,
                  wrapper: 12,
                }"
              />

              <DateElement
                name="birthday"
                placeholder="生日"
                field-name="生日"
                :rules="['required', 'before:today']"
                display-format="YYYY-MM-DD"
              />

              <!-- <RadiogroupElement
                name="gender"
                :items="[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                  { value: 'other', label: '其他' },
                ]"
                label="性別"
                :rules="['required']"
              /> -->


              <TextElement name="gender" placeholder="性別" rules="required" />

              <!-- <CheckboxElement name="terms" text="I accept the Terms & Conditions & Privacy Policy" rules="accepted" /> -->
              <StaticElement name="divider_1" tag="hr" />
              <ButtonElement
                name="register"
                button-label="註冊"
                :full="true"
                size="lg"
                @click="register"
                :submits="true"
              />
            </Vueform>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";

const form$ = ref(null);
const router = useRouter();

function register() {
  let request = {
    accountNumber: accountNumber.value,
    password: password.value,
    email: email.value,
    nickname: nickname.value,
    phoneNumber: phoneNumber.value,
    country: country.value,
    city: city.value,
    birthday: birthday.value,
    gender: gender.value,
  };

  console.log(request);
  axios
    .post("/user/register", request)
    .then(function (response) {
      console.log("response", response);

      if (response.data.success) {
        router.push("/login");
      }
    })
    .catch(function (error) {
      console.log("error", error);
    });
}
</script>

<style scoped>
.card-img-left {
  width: 45%;
  /* Link to your background image using in the property below! 
  background: scroll center
    url("https://source.unsplash.com/WEQbe2jBg40/414x512"); */
  background-size: cover;
}

.btn-google {
  color: white;
  background-color: #ea4335;
}
</style>
