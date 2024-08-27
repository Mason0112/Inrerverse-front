<template>
    <div class="container update-form">

        <h6 class="section-title">編輯個人資料</h6>
        <Vueform size="md" :display-errors="false" ref="form$" :endpoint="false">
            <TextElement name="email" input-type="email" :rules="[
                'required',
                'max:255',
                'email',
            ]" field-name="Email" label="Email" default="xxx"/>

            <TextElement name="nickname" rules="required" label="暱稱"/>

            <PhoneElement name="phoneNumber" :rules="[
                'required',
            ]" field-name="電話號碼" :allow-incomplete="true" :unmask="false" label="電話號碼"/>
            <SelectElement name="country1" :search="true" :native="false" input-type="search" autocomplete="disabled"
                placeholder="國籍" items="/json/countries.json" :columns="{
                    container: 6,
                    label: 12,
                    wrapper: 12,
                }" />
            <TextElement name="country" rules="required" label="國籍" :columns="{
                container: 6,
                label: 12,
                wrapper: 12,
            }" />
            <TextElement name="city" label="居住城市" rules="required" :columns="{
                container: 6,
                label: 12,
                wrapper: 12,
            }" />
            <DateElement name="birthday" label="生日" field-name="生日" :rules="[
                'required', 'before:today'
            ]" display-format="YYYY-MM-DD" />
            <TextElement name="gender" label="性別" rules="required" />
            <TextareaElement name="textarea" label="自介"/>
            <ButtonElement name="cancel" button-label="取消" size="lg" align="right"/>
            <ButtonElement name="register" button-label="更新" size="lg":submits="true" align="right"/>

            <!-- @click="register"  -->
        </Vueform>

    </div>
</template>
    
<script setup>
    import { ref } from 'vue';

</script>


<style scope>
.update-form {
    width: 75%;
}
</style>