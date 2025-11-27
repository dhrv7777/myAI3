"use client";

import { OnboardingScreen } from "@/components/onboarding-screen";

// ... existing imports

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingData, setOnboardingData] = useState<string | null>(null);

  // ... existing code

  const handleOnboardingComplete = (data: string) => {
    setOnboardingData(data);
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  // ... existing code

  function onSubmit(data: z.infer<typeof formSchema>) {
    let textToSend = data.message;
    if (onboardingData && messages.length <= 1) {
      textToSend = `${textToSend}\n\n${onboardingData}`;
      // Clear onboarding data after sending so it's not appended again
      setOnboardingData(null);
    }
    sendMessage({ text: textToSend });
    form.reset();
  }

  const handleSuggestionClick = (suggestion: string) => {
    let textToSend = suggestion;
    if (onboardingData && messages.length <= 1) {
      textToSend = `${textToSend}\n\n${onboardingData}`;
      setOnboardingData(null);
    }
    sendMessage({ text: textToSend });
  };

  // ... existing code

  return (
    <div className="flex h-screen items-center justify-center font-sans dark:bg-black">
      {showOnboarding && (
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      <main className="w-full dark:bg-black h-screen relative">
        {/* ... existing JSX ... */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isWelcomeState ? 'bg-transparent backdrop-blur-none' : 'bg-linear-to-b from-background via-background/80 to-transparent backdrop-blur-sm'} overflow-visible pb-20`}>
          <div className="relative overflow-visible">
            <ChatHeader>
              <ChatHeaderBlock />
              <div className={`transition-all duration-700 ease-in-out transform ${isWelcomeState ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <ChatHeaderBlock className="justify-center items-center gap-3">
                  <Avatar
                    className="size-12 ring-2 ring-primary shadow-md transition-transform hover:scale-105"
                  >
                    <AvatarImage src="/logo.png" />
                    <AvatarFallback>
                      <Image src="/logo.png" alt="Logo" width={48} height={48} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-semibold tracking-tight text-foreground">WellWiser</p>
                    <p className="text-xs text-muted-foreground font-medium">Your Wellness Companion</p>
                  </div>
                </ChatHeaderBlock>
              </div>


              <ChatHeaderBlock className="justify-end gap-2">
                <Button
                  variant="outline"
                  size="default"
                  className="cursor-pointer rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={clearChat}
                >
                  <Plus className="size-5 mr-1" />
                  {CLEAR_CHAT_TEXT}
                </Button>
              </ChatHeaderBlock>
            </ChatHeader>
          </div>
        </div>
        <div className="h-screen overflow-y-auto px-5 py-4 w-full pt-[140px] pb-[220px]">
          <div className="flex flex-col items-center justify-end min-h-full">
            {isWelcomeState && (
              <div className="flex flex-col items-center justify-center mb-12 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-10">
                <div className="relative w-32 h-32 mb-6 shadow-2xl rounded-full ring-4 ring-primary/20 bg-background overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="WellWiser Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2 text-center">WellWiser</h1>
                <p className="text-lg text-muted-foreground font-medium tracking-wide uppercase text-center max-w-md">Your Personal Wellness Companion</p>
              </div>
            )}

            {isClient ? (
              <>
                <div className="w-full max-w-4xl">
                  <MessageWall messages={messages} status={status} durations={durations} onDurationChange={handleDurationChange} />
                </div>
                {status === "submitted" && (
                  <div className="flex justify-start max-w-4xl w-full px-4">
                    <Loader2 className="size-6 animate-spin text-primary" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center max-w-4xl w-full">
                <Loader2 className="size-8 animate-spin text-primary/50" />
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-linear-to-t from-background via-background/90 to-transparent dark:bg-black overflow-visible pt-4 pb-6">
          <div className="w-full px-6 items-center flex flex-col justify-center relative overflow-visible gap-4">
            <div className="message-fade-overlay" />

            {isWelcomeState && (
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl w-full animate-in slide-in-from-bottom-4 duration-500 delay-200">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-card/50 hover:bg-primary/10 border border-primary/20 hover:border-primary/50 rounded-full text-sm font-medium text-foreground/80 hover:text-primary transition-all shadow-sm backdrop-blur-sm cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="max-w-4xl w-full">
              <form id="chat-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="chat-form-message" className="sr-only">
                          Message
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id="chat-form-message"
                            className="h-16 pr-16 pl-6 bg-card/80 backdrop-blur-md border-primary/20 shadow-lg rounded-[24px] text-lg focus-visible:ring-primary/50 focus-visible:border-primary transition-all hover:shadow-xl hover:border-primary/30"
                            placeholder="How can I help you live healthier today?"
                            disabled={status === "streaming"}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                          />
                          {(status == "ready" || status == "error") && (
                            <Button
                              className="absolute right-3 top-3 rounded-full size-10 shadow-sm transition-transform hover:scale-105 active:scale-95"
                              type="submit"
                              disabled={!field.value.trim()}
                              size="icon"
                            >
                              <ArrowUp className="size-5" />
                            </Button>
                          )}
                          {(status == "streaming" || status == "submitted") && (
                            <Button
                              className="absolute right-3 top-3 rounded-full size-10 shadow-sm"
                              size="icon"
                              onClick={() => {
                                stop();
                              }}
                            >
                              <Square className="size-4 fill-current" />
                            </Button>
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </div>
          </div>
          <div className="w-full px-5 py-2 items-center flex justify-center text-xs text-muted-foreground font-medium opacity-70">
            © {new Date().getFullYear()} {OWNER_NAME}&nbsp;•&nbsp;<Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>&nbsp;•&nbsp;Powered by&nbsp;<Link href="https://ringel.ai/" className="hover:text-primary transition-colors">Ringel.AI</Link>
          </div>
        </div>
      </main>
    </div >
  );
}
