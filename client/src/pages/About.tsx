import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

const values = [
  {
    icon: Heart,
    title: "Passion for Nature",
    description:
      "We are deeply committed to preserving Azerbaijan's natural beauty for future generations.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Building a strong network of environmental advocates across all regions of Azerbaijan.",
  },
  {
    icon: Lightbulb,
    title: "Education & Awareness",
    description:
      "Empowering citizens with knowledge about environmental protection through engaging activities.",
  },
  {
    icon: Globe,
    title: "Sustainable Future",
    description:
      "Working towards a balanced ecosystem where nature and development coexist harmoniously.",
  },
];

const team = [
  {
    name: "Muhammad Abdulla",
    role: "Developer",
    image: muhammadImg,
    bio: "Leading environmental initiatives across Azerbaijan.",
  },
  {
    name: "Fuad Aliyev",
    role: "Developer",
    image: fuadImg,
    bio: "Expert in biodiversity preservation with focus on Caucasus ecosystems.",
  },
  {
    name: "Khadica Mammadli",
    role: "Improvement Department",
    image: khadicaImg,
    bio: "Connecting volunteers with meaningful environmental projects nationwide.",
  },
  {
    name: "Serhad Farhadli",
    role: "Researching Assistant",
    image: serhadImg,
    bio: "Developing engaging environmental education programs for all ages.",
  },
];

const achievements = [
  { value: "3", label: "Years of Impact" },
  { value: "2,500+", label: "Trees Planted" },
  { value: "12", label: "Partner Organizations" },
  { value: "850+", label: "Volunteers Engaged" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Leaf className="h-4 w-4" />
                <span>About Our Mission</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl font-bold mb-6"
                data-testid="text-about-title"
              >
                Protecting Azerbaijan's{" "}
                <span className="text-primary">Natural Heritage</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                EcoAzerbaijan is a dedicated environmental organization working
                to preserve the rich biodiversity and natural beauty of
                Azerbaijan. Through education, community engagement, and direct
                conservation efforts, we're building a sustainable future for
                our nation.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-slide-in-left" style={{ opacity: 0 }}>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We believe that environmental protection starts with awareness
                  and community action. Our mission is to engage citizens of all
                  ages in understanding and protecting Azerbaijan's unique
                  ecosystems, from the Caspian coastline to the peaks of the
                  Greater Caucasus.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Through our competitions, events, and educational programs, we
                  aim to create a generation of environmentally conscious
                  citizens who will champion sustainable practices in their
                  daily lives and communities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 animate-slide-in-right" style={{ opacity: 0 }}>
                {achievements.map((achievement, index) => (
                  <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                    <CardContent className="p-6">
                      <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                        {achievement.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {achievement.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Our Core Values
              </h2>
              <p className="text-muted-foreground text-lg">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="card-hover-lift text-center group">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-secondary/30">
                      <value.icon className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground text-lg">
                Dedicated professionals working for a greener Azerbaijan
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="card-hover-lift group">
                  <CardContent className="p-6 text-center space-y-4">
                    <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300 group-hover:scale-105">
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
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{member.name}</h3>
                      <p className="text-sm text-primary font-medium">
                        {member.role}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6 mx-auto">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Our Impact
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Since our founding, we've worked tirelessly to protect
                Azerbaijan's natural treasures. From organizing nationwide
                tree-planting campaigns to running educational programs in
                schools, our initiatives have touched thousands of lives and
                made a real difference in environmental conservation across the
                country.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TreePine className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Conservation</h3>
                    <p className="text-sm text-muted-foreground">
                      Active preservation programs in 10+ national parks
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Youth chapters in all major cities of Azerbaijan
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Lightbulb className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Education</h3>
                    <p className="text-sm text-muted-foreground">
                      Environmental curriculum reaching 500+ schools
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
