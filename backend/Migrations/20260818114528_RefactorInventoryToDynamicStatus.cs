using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RefactorInventoryToDynamicStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "InventoryItems");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "InventoryItems",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CriticalLimit",
                table: "InventoryItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "WarningLimit",
                table: "InventoryItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "InventoryCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventoryCategories_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_CategoryId",
                table: "InventoryItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryCategories_UserId",
                table: "InventoryCategories",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventoryCategories_CategoryId",
                table: "InventoryItems",
                column: "CategoryId",
                principalTable: "InventoryCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventoryCategories_CategoryId",
                table: "InventoryItems");

            migrationBuilder.DropTable(
                name: "InventoryCategories");

            migrationBuilder.DropIndex(
                name: "IX_InventoryItems_CategoryId",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "CriticalLimit",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "WarningLimit",
                table: "InventoryItems");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "InventoryItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "InventoryItems",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
