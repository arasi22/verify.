import discord
from discord import app_commands
from discord.ext import commands

intents = discord.Intents.default()
intents.guilds = True

class RoleButton(discord.ui.Button):
    def __init__(self, label, style, role=None):
        super().__init__(label=label, style=style)
        self.role = role

    async def callback(self, interaction: discord.Interaction):
        if self.role:
            if self.role in interaction.user.roles:
                await interaction.response.send_message(f"You already have the {self.role.name} role!", ephemeral=True)
            else:
                await interaction.user.add_roles(self.role)
                await interaction.response.send_message(f"You have been given the {self.role.name} role!", ephemeral=True)

class RoleSelectView(discord.ui.View):
    def __init__(self, role: discord.Role):
        super().__init__()
        self.add_item(RoleButton(label="Verify ✅", style=discord.ButtonStyle.success, role=role))

class MyClient(discord.Client):
    def __init__(self):
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        await self.tree.sync()

    async def on_ready(self):
        print(f"Logged in as {self.user}")

client = MyClient()

@client.tree.command(name="verify", description="ロールを選択してパネルを作成します。")
@app_commands.describe(role="ロールを選択してください")
async def verify(interaction: discord.Interaction, role: discord.Role):
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message("このコマンドを使用するには管理者権限が必要です。", ephemeral=True)
        return

    embed = discord.Embed(description="> ボタンを押して認証してください\n> 認証後 @member が付与されます…", color=discord.Color.blue())
    await interaction.response.send_message(embed=embed, view=RoleSelectView(role))


client.run("MTI3MTI3NDE3MTc2MjA4NjAyMw.G9l6Ww.5zi_zOwmuF5sg8glRLrF6c48u6GuGeLSxtqZWI")
