<template>
    <div>
        <v-dialog v-model="show">
            <v-card>
                <v-card-title>
                <h4>{{ member.id ? '修改' : '新增' }}</h4>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-radio-group v-model="member.gender" row>
                                <v-radio label="男" value="男"></v-radio>
                                <v-radio label="女" value="女"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-select :items="schools" label="地區" v-model="member.school" ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                            <v-col cols="12">
                            <v-text-field label="姓名" v-model="member.name" clearable></v-text-field>
                            </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-select :items="categories" label="課程" autocomplete hide-selected
                            v-model="member.category" required></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="!formIsValid" @click="updateMember"> {{ member.id ? '修改' : '新增' }}</v-btn>
                    <v-btn @click.stop="show = false">X</v-btn>
                </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>
<script>

export default {
    props: ['visible','member'],
    data(){
        return {
            schools:['士C','士D','地南','古來'],
        }
    },
    computed: {
        show: {
            get(){
                return this.visible
            },
            set(value){
                if (!value) {
                    this.$emit('close')
                }
            }
        },
        categories() {
            return this.$store.getters.categories;
        },
        formIsValid() {
            return this.member.gender != '' 
            && this.member.school != ''
            && this.member.name != '' 
            && this.member.category != '';
        },
    },
    methods: {
        updateMember(){
            if (this.member.id){
                this.$emit('updateMember',this.member)
            }else{
                this.$emit('createMember',this.member)
            }
        }
    }

}
</script>