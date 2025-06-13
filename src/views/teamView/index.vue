<template>
    <section class="team-builder">
        <h2 class="title">阵容搭配及整体输出手法</h2>
        <div class="search-box">
            <input v-model="searchKeyword" placeholder="搜索主C角色..." class="search-input" />
        </div>
        <div class="mainc-rows">
            <div v-for="group in filteredByMainC" :key="group.main.name" class="mainc-group">
                <div class="mainc-header">
                    <img :src="group.main.icon" :alt="group.main.name" class="mainc-icon" />
                    <h3 class="mainc-name">{{ group.main.name }}</h3>
                </div>
                <div class="teams">
                    <div v-for="team in group.teams" :key="team.name" class="team-card">
                        <div class="members">
                            <div v-for="m in team.members" :key="m.name" class="member">
                                <img :src="m.icon" :alt="m.name" class="member-icon" />
                                <p class="member-name">{{ m.name }}</p>
                            </div>
                        </div>
                        <div class="team-tech">
                            <h4>{{ team.name }} 输出手法</h4>
                            <p>{{ team.technique }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="filteredByMainC.length === 0" class="none">无匹配主C结果</p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
interface Member { name: string; icon: string; }
interface Team { name: string; members: Member[]; technique: string; }
interface MainGroup { main: Member; teams: Team[]; }
// 批量导入 avatar 目录下所有 .webp 文件，eager: true 表示打包时就加载
const avatars = import.meta.glob('@/assets/avatar/*.webp', {
    eager: true,
    import: 'default'
}) as Record<string, string>;
console.log("avatar", avatars)
// 根据文件名（不含后缀）取路径
function getIcon(name: string) {
    // 注意路径键名要和实际文件夹结构对应
    const key = `/src/assets/avatar/${name}.webp`;
    return avatars[key] || '';
}
// 示例角色图标路径需替换
const mainGroups = ref<MainGroup[]>([
    {
        main: { name: '今汐', icon: getIcon('jinxi') },
        teams: [
            {
                name: '水火双核稳定流',
                members: [
                    { name: '今汐', icon: '/assets/jinhsi.png' },
                    { name: '椿', icon: '/assets/chun.png' },
                    { name: '秧秧', icon: '/assets/yangyang.png' }],
                technique: '今汐连招附水，切椿触发扩散，切秧秧控场续航。'
            },
            {
                name: '水火双核稳定流',
                members: [
                    { name: '今汐', icon: '/assets/jinhsi.png' },
                    { name: '椿', icon: '/assets/chun.png' },
                    { name: '秧秧', icon: '/assets/yangyang.png' }],
                technique: '今汐连招附水，切椿触发扩散，切秧秧控场续航。'
            }
        ]
    },
    {
        main: { name: '椿', icon: '/assets/chun.png' },
        teams: [
            {
                name: '火控扩散速通队',
                members: [
                    { name: '椿', icon: '/assets/chun.png' },
                    { name: '尧里要', icon: '/assets/yaoyao.png' },
                    { name: '丹瑾', icon: '/assets/danjin.png' }],
                technique: '椿快速清怪，用丹瑾续航，尧里要增强火元素输出。'
            }
        ]
    },
    {
        main: { name: '忌炎', icon: '/assets/jiyan.png' },
        teams: [
            {
                name: '沉默先手爆发队',
                members: [
                    { name: '忌炎', icon: '/assets/jiyan.png' },
                    { name: '渊武', icon: '/assets/yuanwu.png' },
                    { name: '白芷', icon: '/assets/baizhi.png' }],
                technique: '忌炎先沉默敌人，渊武雷反应配合白芷治疗续场。'
            }
        ]
    }
]);

const searchKeyword = ref('');
const filteredByMainC = computed(() => {
    const kw = searchKeyword.value.trim().toLowerCase();
    if (!kw) return mainGroups.value;
    return mainGroups.value.filter(g =>
        g.main.name.toLowerCase().includes(kw)
    );
});
</script>

<style lang="scss" scoped>
.team-builder {
    padding: 2rem;
    background: #0b0d1e;
    color: #e0e7ff;
    min-height: calc(100vh - 60px);
    margin-top: 60px;

    .title {
        font-size: 2rem;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .search-box {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;

        .search-input {
            width: 300px;
            padding: .6rem 1rem;
            border: none;
            border-radius: 999px;
            background: #1d203d;
            color: #cbd5e1;

            &::placeholder {
                color: #6b7280;
            }
        }
    }

    .mainc-group {
        margin-bottom: 3rem;

        .mainc-header {
            display: flex;
            align-items: center;

            .mainc-icon {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                border: 2px solid #3f4c7a;
                margin-right: 1rem;
            }

            .mainc-name {
                font-size: 1.5rem;
            }
        }

        .teams {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;

            .team-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 1rem;
                overflow: hidden;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                transition: transform .3s;

                &:hover {
                    transform: translateY(-5px);
                }

                .members {
                    display: flex;
                    justify-content: space-around;
                    padding: 1rem;
                    background: #14172a;

                    .member {
                        text-align: center;

                        .member-icon {
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            border: 2px solid #4f5a85;
                        }

                        .member-name {
                            margin-top: .5rem;
                            font-size: .9rem;
                        }
                    }
                }

                .team-tech {
                    background: #1a1c2f;
                    padding: 1rem;

                    h4 {
                        margin: 0 0 .5rem;
                        font-size: 1.1rem;
                        color: #fde68a;
                    }

                    p {
                        font-size: .9rem;
                        line-height: 1.4;
                    }
                }
            }
        }
    }

    .none {
        text-align: center;
        color: #6b7280;
        margin-top: 2rem;
    }

    @media (max-width: 768px) {
        .team-builder {
            padding: 1rem;

            .search-input {
                width: 100%;
                max-width: none;
            }

            .mainc-header {
                flex-direction: column;
                align-items: center;

                .mainc-icon {
                    width: 48px;
                    height: 48px;
                    margin-bottom: 0.5rem;
                }

                .mainc-name {
                    font-size: 1.25rem;
                }
            }

            .teams {
                grid-template-columns: 1fr !important;
                gap: 1rem;
            }

            .team-card {
                .members {
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .team-tech {
                    padding: 0.75rem;

                    h4 {
                        font-size: 1rem;
                    }

                    p {
                        font-size: 0.85rem;
                    }
                }
            }
        }
    }

}
</style>
