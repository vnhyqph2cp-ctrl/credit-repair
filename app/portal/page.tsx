// pseudo-logic (NOT for today)
if (!user) redirect("/login");
if (!snapshotConnected) redirect("/dashboard/mfsn/enroll");
if (!analyzerRun) redirect("/dashboard/analyzer");
if (openEnforcement) redirect("/dashboard/enforcement");
redirect("/dashboard");
