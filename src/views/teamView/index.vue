<template>
  <section class="team-builder">
    <h2 class="title">阵容搭配及整体输出手法</h2>
    <div class="search-box">
      <input
        v-model="searchKeyword"
        placeholder="搜索主C角色..."
        class="search-input"
      />
    </div>
    <div class="mainc-rows">
      <div
        v-for="group in filteredByMainC"
        :key="group.main.name"
        class="mainc-group"
      >
        <div class="mainc-header">
          <img
            :src="group.main.icon"
            :alt="group.main.name"
            class="mainc-icon"
          />
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
              <p>{{ team.technique1 }}</p>
            </div>
          </div>
        </div>
      </div>
      <p v-if="filteredByMainC.length === 0" class="none">无匹配主C结果</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
interface Member {
  name: string;
  icon: string;
}
interface Team {
  name: string;
  members: Member[];
  technique: string;
  technique1: string;
}
interface MainGroup {
  main: Member;
  teams: Team[];
}
// 批量导入 avatar 目录下所有 .webp 文件，eager: true 表示打包时就加载
const avatars = import.meta.glob("@/assets/avatar/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;
console.log("avatar", avatars);
// 根据文件名（不含后缀）取路径
function getIcon(name: string) {
  // 注意路径键名要和实际文件夹结构对应
  const key = `/src/assets/avatar/${name}.webp`;
  return avatars[key] || "";
}
// 示例角色图标路径需替换
const mainGroups = ref<MainGroup[]>([
  {
    main: { name: "椿", icon: getIcon("chun") },
    teams: [
      {
        name: "椿散维",
        members: [
          { name: "椿", icon: getIcon("chun") },
          { name: "散华", icon: getIcon("sanhua") },
          { name: "维里奈", icon: getIcon("akijueyuan") },
        ],
        technique:
          "启动轴：散华er重-维里奈打满协奏（3aeqr重aa)-椿小爆发（e重e）-散华eq-椿大爆发（r4qee重e）依此循环",
        technique1: "循环轴：就是把上面的接着打",
      },
      {
        name: "椿散守",
        members: [
          { name: "椿", icon: getIcon("chun") },
          { name: "散华", icon: getIcon("sanhua") },
          { name: "守岸人", icon: getIcon("shouanren") },
        ],
        technique:
          "启动轴：椿:Q -> 散华: ER(A) ->守岸人: a4(A) ,a4(A) , ERQ -> 椿: E 紅a(A) E ->散华: E Q -> 椿: R E (A)*2 Q => 循环轴",
        technique1:
          "循环轴：守岸人: 洞悉入場a4(A) -> 散华: ER(A) -> 守岸人: ERQ -> 椿: E 紅a(A) E -> 散华: E Q -> 椿: R (A) Q=>重复",
      },
    ],
  },
  {
    main: { name: "珂莱塔", icon: getIcon("kelaita") },
    teams: [
      {
        name: "全息专用",
        members: [
          { name: "珂莱塔", icon: getIcon("kelaita") },
          { name: "守岸人", icon: getIcon("shouanren") },
          { name: "维里奈", icon: getIcon("akijueyuan") },
        ],
        technique:
          "这个真没手法，我自己用来打全息的，维里奈和守岸人都带冰乌龟，进场守岸人打满协奏切维里奈再打满协奏切土豆打完一套就进循环",
        technique1: "",
      },
      {
        name: "柯折守",
        members: [
          { name: "珂莱塔", icon: getIcon("kelaita") },
          { name: "折枝", icon: getIcon("zhezhi") },
          { name: "守岸人", icon: getIcon("shouanren") },
        ],
        technique:
          "守岸人（4A-重击A），珂莱塔（E1-E2），守岸人（4A-E-Q-R-重击A），【变奏】折枝（3A-E-重击A-Q-3E-R），【变奏】珂莱塔（E1-E2-重击A-5R-E1-E2-Q）//【变奏】守岸人（4A-E-Q-R-重击A），【变奏】折枝（3A-E-重击A-Q-3E-R），【变奏】珂莱塔（E1-E2-重击A-5R-E1-E2-Q）",
        technique1: "",
      },
    ],
  },
  {
    main: { name: "赞妮", icon: getIcon("zan_ni") },
    teams: [
      {
        name: "赞菲守",
        members: [
          { name: "赞妮", icon: getIcon("zan_ni") },
          { name: "菲比", icon: getIcon("feibi") },
          { name: "守岸人", icon: getIcon("shouanren") },
        ],
        technique:
          "启动轴：赞妮小技能盾牌弹反→切守岸人普攻，重击时→切菲比小技能定身→切守岸人 普攻，重击，小技能，声骸，大招→菲比变奏入场小技能蓝色状态，大招，声骸，普攻接重击/闪避反击接重击(打两次重击消耗掉蓝条)→赞妮变奏入场小技能弹反，大招，小技能弹反打强化普攻3，小技能弹反打强化普攻3，小技能蓄力自动打强化普攻3，打最后一段大招",
        technique1:
          "循环轴：菲比变奏入场小技能定身→切守岸人两套普攻重击，小技能，声骸，大招，满协奏→菲比变奏入场蓝色状态，大招，声骸→赞妮变奏入场，小技能打一次普攻能量条满，大招打完",
      },
    ],
  },
  {
    main: { name: "今汐", icon: getIcon("jinxi") },
    teams: [
      {
        name: "龙凤维",
        members: [
          { name: "今汐", icon: getIcon("jinxi") },
          { name: "长离", icon: getIcon("changli") },
          { name: "维里奈", icon: getIcon("akijueyuan") },
        ],
        technique:
          "长离切维神，维神AAe叠两层被动，开大r，开q套盾，起跳a两下切长离长离入场，落地开三段q，开大r接重击，两次ea叠两层被动，再打几下攒满协奏切今汐（此时长离有两层被动）今汐入场，开q开e开大r，a四下放二段e，切长离长离入场获得第三层被动，ea叠第四层被动，重击（一轮循环结束）切维里奈重复以上",
        technique1: "",
      },
    ],
  },
  {
    main: { name: "卡提希娅", icon: getIcon("katixiya") },
    teams: [
      {
        name: "卡夏风",
        members: [
          { name: "卡提希娅", icon: getIcon("katixiya") },
          { name: "夏空", icon: getIcon("xiakong") },
          { name: "风主", icon: getIcon("woman") },
        ],
        technique:
          "卡夏我都没有就不写手法了",
        technique1: "",
      },
    ],
  },
]);

const searchKeyword = ref("");
const filteredByMainC = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase();
  if (!kw) return mainGroups.value;
  return mainGroups.value.filter((g) => g.main.name.toLowerCase().includes(kw));
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
      padding: 0.6rem 1rem;
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
        transition: transform 0.3s;

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
              margin-top: 0.5rem;
              font-size: 0.9rem;
            }
          }
        }

        .team-tech {
          background: #1a1c2f;
          padding: 1rem;

          h4 {
            margin: 0 0 0.5rem;
            font-size: 1.1rem;
            color: #fde68a;
          }

          p {
            font-size: 0.9rem;
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
