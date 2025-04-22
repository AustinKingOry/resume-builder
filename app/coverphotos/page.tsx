import CoverGenerator from "@/components/coverphotos/cover-generator"
import { Briefcase, ImageIcon, Palette } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

const MainSection = () => {
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted mt-12">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            MyCoverPhotos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create professional cover images that make your social media profiles stand out and leave a lasting
            impression
          </p>
        </header>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Generator</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>About</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <CoverGenerator />
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-primary/10">
              <CardContent className="pt-6">
                <div className="max-w-2xl mx-auto prose">
                  <h2 className="text-2xl font-semibold text-primary mb-4">About This Tool</h2>
                  <p>
                    MyCoverPhotos allows you to create professional, eye-catching cover images for your social media
                    profiles. Choose from multiple templates, customize colors and text, and download your creation in
                    seconds.
                  </p>

                  <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h3 className="text-primary font-medium mb-2 flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Professional Design
                      </h3>
                      <p className="text-sm">
                        Choose from professionally designed templates that follow platform best practices
                      </p>
                    </div>
                    <div className="bg-secondary/5 p-4 rounded-lg">
                      <h3 className="text-secondary font-medium mb-2 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Easy Customization
                      </h3>
                      <p className="text-sm">Personalize your cover with your own text, colors, and profile image</p>
                    </div>
                    <div className="bg-accent/5 p-4 rounded-lg">
                      <h3 className="text-accent font-medium mb-2 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Career Impact
                      </h3>
                      <p className="text-sm">
                        Make a strong first impression that helps you stand out to recruiters and connections
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-primary mb-3">How to Use</h3>
                  <ol className="space-y-2 mb-6">
                    <li>Select your target platform</li>
                    <li>Enter your information in the form fields</li>
                    <li>Upload a profile picture (optional)</li>
                    <li>Select a template that matches your style</li>
                    <li>Choose a color palette</li>
                    <li>Preview your cover image</li>
                    <li>Click &quot;Download Cover&quot; to save your image</li>
                  </ol>

                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Your preferences are saved automatically for your next visit
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
    )
}

export default MainSection