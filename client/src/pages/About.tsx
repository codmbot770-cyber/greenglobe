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
        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Leaf className="h-4 w-4" />
                <span>{t("aboutMission")}</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl font-bold mb-6"
                data-testid="text-about-title"
              >
                {t("aboutTitle")}{" "}
                <span className="text-primary">{t("naturalHeritage")}</span>
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

        <section className="py-16 bg-[hsl(var(--light-green-bg))]">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t("coreValues")}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t("valuesDescription")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="card-hover-lift text-center group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-primary/30 border-glow-green">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:from-primary/40 group-hover:to-secondary/40 group-hover:shadow-lg">
                      <value.icon className="h-7 w-7 text-primary transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-all duration-300 group-hover:scale-105">{t(value.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                      {t(value.descKey)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t("meetOurTeam")}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t("teamDescription")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="card-hover-lift group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-primary/30">
                  <CardContent className="p-6 text-center space-y-4">
                    <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/10 group-hover:ring-primary/50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                      <AvatarImage
                        src={member.image || undefined}
                        alt={member.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-all duration-300 group-hover:scale-105">{member.name}</h3>
                      <p className="text-sm text-primary font-medium transition-all duration-300 group-hover:text-secondary">
                        {member.role}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                      {t(member.bioKey)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6 mx-auto">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {t("ourImpact")}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t("impactDescription")}
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mt-8">
                <Card className="group transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-glow-green">
                  <CardContent className="p-6 text-center">
                    <TreePine className="h-8 w-8 text-primary mx-auto mb-3 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                    <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-primary">{t("conservation")}</h3>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                      {t("conservationDesc")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="group transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-glow-green">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-secondary mx-auto mb-3 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                    <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-secondary">{t("communityTitle")}</h3>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                      {t("youthChapters")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="group transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-glow-green">
                  <CardContent className="p-6 text-center">
                    <Lightbulb className="h-8 w-8 text-primary mx-auto mb-3 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                    <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-primary">{t("education")}</h3>
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
