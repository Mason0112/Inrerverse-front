<template>
        <h6 class="section-title">編輯個人資料</h6>
        <Vueform size="md" :display-errors="false" ref="form$" :endpoint="false">
            <TextElement name="email" input-type="email" :rules="[
                'required',
                'max:255',
                'email',
            ]" placeholder="請輸入Email" field-name="Email"
                description="You will receive a confirmation letter to this email." />

            <TextElement name="nickname" placeholder="請輸入暱稱" rules="required" />

            <PhoneElement name="phoneNumber" placeholder="請輸入電話號碼" :rules="[
                'required',
            ]" field-name="電話號碼" :allow-incomplete="true" :unmask="true" />
            <SelectElement name="country1" :search="true" :native="false" input-type="search" autocomplete="disabled"
                placeholder="國籍" items="/json/countries.json" :columns="{
                    container: 6,
                    label: 12,
                    wrapper: 12,
                }" />
            <TextElement name="country" placeholder="請輸入國籍" rules="required" :columns="{
                container: 6,
                label: 12,
                wrapper: 12,
            }" />
            <TextElement name="city" placeholder="請輸入居住城市" rules="required" :columns="{
                container: 6,
                label: 12,
                wrapper: 12,
            }" />
            <DateElement name="birthday" placeholder="生日" field-name="生日" :rules="[
                'required', 'before:today'
            ]" display-format="YYYY-MM-DD" />
            <TextElement name="gender" placeholder="性別" rules="required" />
            <ButtonElement name="register" button-label="取消" :full="true" size="lg" :columns="{
                container: 6,
                label: 12,
                wrapper: 12,
            }"/>
            <ButtonElement name="register" button-label="更新" :full="true" size="lg":submits="true" :columns="{
                container: 6,
                label: 12,
                wrapper: 12,
            }"/>

            <!-- @click="register"  -->
        </Vueform>
</template>
    
<script setup>
    import { ref } from 'vue';

</script>


<style>
    body{
    margin-top:20px;
    background:#FAFAFA;    
}
</style>