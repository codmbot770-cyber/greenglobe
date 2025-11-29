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

import muhammadImg from "@assets/WhatsApp Image 2025-11-29 at 16.24.36 (3)_1764419215676.jpeg";
import fuadImg from "@assets/WhatsApp Image 2025-11-29 at 16.24.36 (2)_1764419215677.jpeg";
import khadicaImg from "@assets/WhatsApp Image 2025-11-29 at 16.24.36_1764419215678.jpeg";
import serhadImg from "@assets/WhatsApp Image 2025-11-29 at 16.24.36 (1)_1764419215677.jpeg";

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
  { value: "15+", label: "Years of Impact" },
  { value: "50,000+", label: "Trees Planted" },
  { value: "100+", label: "Partner Organizations" },
  { value: "25,000+", label: "Volunteers Engaged" },
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
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

              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                        {achievement.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
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
                <Card key={index} className="hover-elevate text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mx-auto">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
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
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6 text-center space-y-4">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage
                        src={member.image || undefined}
                        alt={member.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
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
