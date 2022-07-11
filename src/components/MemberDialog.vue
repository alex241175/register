<template>
    <div>
        <v-dialog v-model="show">
            <v-card>
                <v-card-title>
                <h4>修改</h4>
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
                            <v-text-field label="備註" v-model="member.remark" clearable></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="update">修改</v-btn>
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
        }
    },
    methods: {
        update(){
            this.$emit('updateMember',this.member)
        }
    }

}
</script>