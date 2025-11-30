import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Target,
  Heart,
  Users,
  Lightbulb,
  Globe,
  Award,
  TreePine,
  Leaf,
} from "lucide-react";

import muhammadImg from "@assets/mehemmed_abdulla_1764419606548.jpeg";
import fuadImg from "@assets/fuad_eliyev_1764419606548.jpeg";
import khadicaImg from "@assets/xedice_ehmedli_1764419606549.jpeg";
import serhadImg from "@assets/ferhad_serhadli_1764419606547.jpeg";

const team = [
  {
    name: "Muhammad Abdulla",
    role: "Developer",
    image: muhammadImg,
    bioKey: "muhammadBio" as const,
  },
  {
    name: "Fuad Aliyev",
    role: "CEO & Developer",
    image: fuadImg,
    bioKey: "fuadBio" as const,
  },
  {
    name: "Khadica Mammadli",
    role: "Improvement Department",
    image: khadicaImg,
    bioKey: "khadicaBio" as const,
  },
  {
    name: "Serhad Farhadli",
    role: "Researching Assistant",
    image: serhadImg,
    bioKey: "serhadBio" as const,
  },
];

export default function About() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Heart,
      titleKey: "passionForNature" as const,
      descKey: "passionForNatureDesc" as const,
    },
    {
      icon: Users,
      titleKey: "communityFirst" as const,
      descKey: "communityFirstDesc" as const,
    },
    {
      icon: Lightbulb,
      titleKey: "educationAwareness" as const,
      descKey: "educationAwarenessDesc" as const,
    },
    {
      icon: Globe,
      titleKey: "sustainableFuture" as const,
      descKey: "sustainableFutureDesc" as const,
    },
  ];

  const achievements = [
    { value: "3", labelKey: "yearsOfImpact" as const },
    { value: "2,500+", labelKey: "treesPlanted" as const },
    { value: "12", labelKey: "partnerOrganizations" as const },
    { value: "850+", labelKey: "volunteersEngaged" as const },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-br from-emerald-100/80 via-teal-50/50 to-cyan-100/60 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-cyan-950/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-lime-400/10 to-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-5 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6 border border-emerald-300/30 dark:border-emerald-700/30 shadow-lg shadow-emerald-500/10">
                <Leaf className="h-4 w-4 animate-pulse" />
                <span>{t("aboutMission")}</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl font-bold mb-6"
                data-testid="text-about-title"
              >
                {t("aboutTitle")}{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">{t("naturalHeritage")}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {t("aboutDescription")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-slide-in-left" style={{ opacity: 0 }}>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">{t("ourMission")}</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("missionText1")}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("missionText2")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 animate-slide-in-right" style={{ opacity: 0 }}>
                {achievements.map((achievement, index) => (
                  <Card key={index} className="text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-transparent hover:border-primary/30 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2 transition-transform duration-300 group-hover:scale-110">
                        {achievement.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium transition-colors duration-300 group-hover:text-foreground">
                        {t(achievement.labelKey)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/60 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/30 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full blur-2xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 rounded-full blur-2xl" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">{t("coreValues")}</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                {t("valuesDescription")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const colors = [
                  { bg: "from-rose-500/20 to-pink-500/20", hover: "group-hover:from-rose-500/40 group-hover:to-pink-500/40", text: "text-rose-600 dark:text-rose-400" },
                  { bg: "from-violet-500/20 to-purple-500/20", hover: "group-hover:from-violet-500/40 group-hover:to-purple-500/40", text: "text-violet-600 dark:text-violet-400" },
                  { bg: "from-amber-500/20 to-orange-500/20", hover: "group-hover:from-amber-500/40 group-hover:to-orange-500/40", text: "text-amber-600 dark:text-amber-400" },
                  { bg: "from-cyan-500/20 to-teal-500/20", hover: "group-hover:from-cyan-500/40 group-hover:to-teal-500/40", text: "text-cyan-600 dark:text-cyan-400" },
                ];
                const color = colors[index % colors.length];
                return (
                  <Card key={index} className="card-hover-lift text-center group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-primary/30 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className={`inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br ${color.bg} mx-auto transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 ${color.hover} group-hover:shadow-lg`}>
                        <value.icon className={`h-7 w-7 ${color.text} transition-all duration-300 group-hover:scale-110`} />
                      </div>
                      <h3 className={`text-lg font-bold transition-all duration-300 group-hover:scale-105 group-hover:${color.text}`}>{t(value.titleKey)}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                        {t(value.descKey)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-violet-50/60 via-purple-50/40 to-fuchsia-50/50 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-fuchsia-950/30 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-gradient-to-br from-fuchsia-400/20 to-pink-500/20 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">{t("meetOurTeam")}</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                {t("teamDescription")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => {
                const ringColors = [
                  "ring-rose-400/30 group-hover:ring-rose-500/60",
                  "ring-violet-400/30 group-hover:ring-violet-500/60",
                  "ring-amber-400/30 group-hover:ring-amber-500/60",
                  "ring-cyan-400/30 group-hover:ring-cyan-500/60",
                ];
                return (
                  <Card key={index} className="card-hover-lift group cursor-pointer transition-all duration-500 hover:shadow-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/50 dark:border-gray-800/50">
                    <CardContent className="p-6 text-center space-y-4">
                      <Avatar className={`h-24 w-24 mx-auto ring-4 ${ringColors[index % ringColors.length]} transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                        <AvatarImage
                          src={member.image || undefined}
                          alt={member.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xl">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-all duration-300 group-hover:scale-105">{member.name}</h3>
                        <p className="text-sm text-violet-600 dark:text-violet-400 font-medium transition-all duration-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400">
                          {member.role}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                        {t(member.bioKey)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-sky-50/80 via-blue-50/50 to-indigo-50/60 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-indigo-950/30 relative overflow-hidden">
          <div className="absolute top-1/3 left-0 w-64 h-64 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-500/20 mb-6 mx-auto shadow-lg shadow-sky-500/10">
                <Award className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">{t("ourImpact")}</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t("impactDescription")}
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mt-8">
                <Card className="group transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-400/50">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 mx-auto mb-3 transition-all duration-500 group-hover:scale-110 group-hover:from-emerald-500/30 group-hover:to-green-500/30">
                      <TreePine className="h-6 w-6 text-emerald-600 dark:text-emerald-400 transition-all duration-500 group-hover:rotate-12" />
                    </div>
                    <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{t("conservation")}</h3>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                      {t("conservationDesc")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="group transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400/50">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mx-auto mb-3 transition-all duration-500 group-hover:scale-110 group-hover:from-blue-500/30 group-hover:to-cyan-500/30">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 transition-all duration-500 group-hover:rotate-12" />
                    </div>
                    <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t("communityTitle")}</h3>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                      {t("youthChapters")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="group transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-200/50 dark:border-amber-800/50 hover:border-amber-400/50">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 mx-auto mb-3 transition-all duration-500 group-hover:scale-110 group-hover:from-amber-500/30 group-hover:to-yellow-500/30">
                      <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400 transition-all duration-500 group-hover:rotate-12" />
                    </div>
                    <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">{t("education")}</h3>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                      {t("educationReach")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
